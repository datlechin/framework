<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\User\Avatar;

use Flarum\User\User;

/**
 * An interface for a avatar driver.
 *
 * @public
 */
interface DriverInterface
{
    /**
     * Return a avatar for a user.
     */
    public function avatarUrl(User $user): ?string;
}
