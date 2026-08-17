<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[AsController]
final class MeAction
{
    public function __invoke(#[CurrentUser] User $user): User
    {
        return $user;
    }
}
