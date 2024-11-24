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
 * The default driver, which returns the user's avatar URL.
 */
class DefaultDriver implements DriverInterface
{
    public function avatarUrl(User $user): ?string
    {
        return null;
    }
}
