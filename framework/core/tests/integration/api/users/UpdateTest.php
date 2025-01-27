<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Tests\integration\api\users;

use Carbon\Carbon;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\Throttler\EmailChangeThrottler;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\Test;

class UpdateTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                [
                    'id' => 3,
                    'username' => 'normal2',
                    'password' => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim', // BCrypt hash for "too-obscure"
                    'email' => 'normal2@machine.local',
                    'is_email_confirmed' => 1,
                    'last_seen_at' => Carbon::now()->subSecond(),
                ],
                [
                    'id' => 4,
                    'username' => 'normal3',
                    'password' => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim', // BCrypt hash for "too-obscure"
                    'email' => 'normal3@machine.local',
                    'is_email_confirmed' => 1,
                    'last_seen_at' => Carbon::now()->subHour(),
                ]
            ],
        ]);
    }

    protected function giveNormalUsersEditPerms()
    {
        $this->prepareDatabase([
            'group_permission' => [
                ['permission' => 'user.edit', 'group_id' => 3],
                ['permission' => 'user.editCredentials', 'group_id' => 3],
                ['permission' => 'user.editGroups', 'group_id' => 3],
            ],
        ]);
    }

    #[Test]
    public function users_can_see_their_private_information()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => []
                ],
            ])
        );

        // Test for successful response and that the email is included in the response
        $this->assertEquals(200, $response->getStatusCode(), $body = (string) $response->getBody());
        $this->assertStringContainsString('normal@machine.local', $body);
    }

    #[Test]
    public function users_can_not_see_other_users_private_information()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/1', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => []
                ],
            ])
        );

        // Make sure sensitive information is not made public
        $this->assertEquals(200, $response->getStatusCode(), $body = (string) $response->getBody());
        $this->assertStringNotContainsString('admin@machine.local', $body);
    }

    /**
     * This tests the generic user.edit permission used for non-credential/group attributes.
     */
    #[Test]
    public function users_can_update_own_avatar()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/users/2/avatar', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode(), (string) $response->getBody());
    }

    #[Test]
    public function users_cant_update_own_email_if_password_wrong()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'email' => 'someOtherEmail@example.com',
                        ]
                    ],
                    'meta' => [
                        'password' => 'notTheRightPassword!'
                    ]
                ],
            ])
        );

        $this->assertEquals(401, $response->getStatusCode(), (string) $response->getBody());
    }

    #[Test]
    public function users_can_update_own_email()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'email' => 'someOtherEmail@example.com',
                        ]
                    ],
                    'meta' => [
                        'password' => 'too-obscure'
                    ]
                ],
            ])
        );
        $this->assertEquals(200, $response->getStatusCode());
    }

    #[Test]
    public function users_can_request_email_change_in_moderate_intervals()
    {
        for ($i = 0; $i < 2; $i++) {
            $response = $this->send(
                $this->request('PATCH', '/api/users/3', [
                    'authenticatedAs' => 3,
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'email' => 'someOtherEmail@example.com',
                            ]
                        ],
                        'meta' => [
                            'password' => 'too-obscure'
                        ]
                    ],
                ])
            );

            // We don't want to delay tests too long.
            EmailChangeThrottler::$timeout = 1;
            sleep(EmailChangeThrottler::$timeout + 1);
        }

        $this->assertEquals(200, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_request_email_change_too_fast()
    {
        for ($i = 0; $i < 2; $i++) {
            $response = $this->send(
                $this->request('PATCH', '/api/users/3', [
                    'authenticatedAs' => 3,
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'email' => 'someOtherEmail@example.com',
                            ]
                        ],
                        'meta' => [
                            'password' => 'too-obscure'
                        ]
                    ],
                ])
            );
        }

        $this->assertEquals(429, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_update_own_username()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'username' => 'iCantChangeThis',
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function users_can_update_own_preferences()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'preferences' => [
                                'something' => 'else'
                            ]
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(200, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_update_own_groups()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => [
                        'relationships' => [
                            'groups' => [
                                'data' => [
                                    ['id' => 1, 'type' => 'groups']
                                ]
                            ]
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function users_can_update_marked_all_as_read()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'markedAllAsReadAt' => Carbon::now()
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(200, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_activate_themselves()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'isEmailConfirmed' => true
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * This tests the generic user.edit permission used for non-credential/group attributes.
     */
    #[Test]
    public function users_cant_update_others_avatars_without_permission()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/users/2/avatar', [
                'authenticatedAs' => 3,
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_update_others_emails_without_permission()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'email' => 'someOtherEmail@example.com',
                        ]
                    ],
                    'meta' => [
                        'password' => 'too-obscure'
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_update_others_usernames_without_permission()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'username' => 'iCantChangeThis',
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_update_others_groups_without_permission()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'relationships' => [
                            'groups' => [
                                'data' => [
                                    ['id' => 1, 'type' => 'groups']
                                ]
                            ]
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_activate_others_without_permission()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'isEmailConfirmed' => true
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * This tests the generic user.edit permission used for non-credential/group attributes.
     */
    #[Test]
    public function users_can_update_others_avatars_with_permissions()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('DELETE', '/api/users/2/avatar', [
                'authenticatedAs' => 3,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());
    }

    #[Test]
    public function users_can_update_others_emails_with_permission()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'email' => 'someOtherEmail@example.com',
                        ]
                    ]
                ],
            ])
        );
        $this->assertEquals(200, $response->getStatusCode());
    }

    #[Test]
    public function users_can_update_others_usernames_with_permission()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'username' => 'iCanChangeThis',
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(200, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_update_admin_emails_with_permission()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('PATCH', '/api/users/1', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'email' => 'someOtherEmail@example.com',
                        ]
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_update_admin_usernames_with_permission()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('PATCH', '/api/users/1', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'username' => 'iCanChangeThis',
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function users_can_update_others_groups_with_permission()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'relationships' => [
                            'groups' => [
                                'data' => [
                                    ['id' => 4, 'type' => 'groups']
                                ]
                            ]
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(200, $response->getStatusCode(), (string) $response->getBody());
    }

    #[Test]
    public function regular_users_cant_demote_admins_even_with_permission()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('PATCH', '/api/users/1', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'relationships' => [
                            'groups' => [
                                'data' => []
                            ]
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function regular_users_cant_promote_others_to_admin_even_with_permission()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'relationships' => [
                            'groups' => [
                                'data' => [
                                    ['id' => 1, 'type' => 'groups']
                                ]
                            ]
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function regular_users_cant_promote_self_to_admin_even_with_permission()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('PATCH', '/api/users/3', [
                'authenticatedAs' => 3,
                'json' => [
                    'data' => [
                        'relationships' => [
                            'groups' => [
                                'data' => [
                                    ['id' => 1, 'type' => 'groups']
                                ]
                            ]
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function users_cant_activate_others_even_with_permissions()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 2,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'isEmailConfirmed' => true
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function admins_cant_update_others_preferences()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 1,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'preferences' => [
                                'something' => 'else'
                            ]
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function admins_cant_update_marked_all_as_read()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 1,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'markedAllAsReadAt' => Carbon::now()
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    public function admins_can_activate_others()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/2', [
                'authenticatedAs' => 1,
                'json' => [
                    'data' => [
                        'type' => 'users',
                        'attributes' => [
                            'isEmailConfirmed' => true
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(200, $response->getStatusCode());
    }

    #[Test]
    public function admins_cant_demote_self()
    {
        $this->giveNormalUsersEditPerms();
        $response = $this->send(
            $this->request('PATCH', '/api/users/1', [
                'authenticatedAs' => 1,
                'json' => [
                    'data' => [
                        'relationships' => [
                            'groups' => [
                                'data' => []
                            ]
                        ],
                    ]
                ],
            ])
        );
        $this->assertEquals(403, $response->getStatusCode(), (string) $response->getBody());
    }

    #[Test]
    public function last_seen_not_updated_quickly()
    {
        $this->app();

        $user = User::find(3);

        $response = $this->send(
            $this->request('GET', '/api/users/3', [
                'authenticatedAs' => 3,
                'json' => [],
            ])
        );
        $body = json_decode($response->getBody(), true);
        $last_seen = $body['data']['attributes']['lastSeenAt'];

        $this->assertTrue(Carbon::parse($last_seen)->equalTo($user->last_seen_at));
    }

    #[Test]
    public function last_seen_updated_after_long_time()
    {
        $this->app();

        $user = User::find(4);

        $response = $this->send(
            $this->request('GET', '/api/users/4', [
                'authenticatedAs' => 4,
                'json' => [],
            ])
        );
        $body = json_decode($response->getBody(), true);
        $last_seen = $body['data']['attributes']['lastSeenAt'];

        $this->assertFalse(Carbon::parse($last_seen)->equalTo($user->last_seen_at));
    }
}
