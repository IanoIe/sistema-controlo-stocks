<?php

namespace App\DataFixtures;

use App\Entity\AuditLog;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class AuditLogFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        /** @var User $admin */
        $admin = $this->getReference(
            UserFixtures::USER_ADMIN,
            User::class
        );

        // LOG 1 - User creation
        $log1 = new AuditLog();

        $log1->setAction('CREATE');
        $log1->setEntity('User');
        $log1->setOldData(null);
        $log1->setNewData([
            'name' => 'João Silva',
            'email' => 'joao@.com',
            'roles' => ['ROLE_USER'],
            'isActive' => true,
        ]);
        $log1->setUser($admin);

        $manager->persist($log1);


        // LOG 2 - User update
        $log2 = new AuditLog();

        $log2->setAction('UPDATE');
        $log2->setEntity('User');
        $log2->setOldData([
            'name' => 'Maria Santos',
            'isActive' => false,
        ]);
        $log2->setNewData([
            'name' => 'Maria Santos',
            'isActive' => true,
        ]);
        $log2->setUser($admin);

        $manager->persist($log2);


        // LOG 3 - User deletion
        $log3 = new AuditLog();

        $log3->setAction('DELETE');
        $log3->setEntity('User');
        $log3->setOldData([
            'name' => 'Test User',
            'email' => 'teste@.com',
        ]);
        $log3->setNewData(null);
        $log3->setUser($admin);

        $manager->persist($log3);


        // LOG 4 - Stock entry creation
        $log4 = new AuditLog();

        $log4->setAction('CREATE');
        $log4->setEntity('StockEntry');
        $log4->setOldData(null);
        $log4->setNewData([
            'quantity' => 100,
            'description' => 'Test stock entry',
        ]);
        $log4->setUser($admin);

        $manager->persist($log4);


        // LOG 5 - Stock exit creation
        $log5 = new AuditLog();

        $log5->setAction('CREATE');
        $log5->setEntity('StockExit');
        $log5->setOldData(null);
        $log5->setNewData([
            'quantity' => 10,
            'description' => 'Test stock exit',
        ]);
        $log5->setUser($admin);

        $manager->persist($log5);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
