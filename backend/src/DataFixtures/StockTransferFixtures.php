<?php

namespace App\DataFixtures;

use App\Entity\StockTransfer;
use App\Entity\User;
use App\Entity\Warehouse;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class StockTransferFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Retrieve the administrator and warehouses
        $admin = $this->getReference(
            UserFixtures::USER_ADMIN,
            User::class
        );

        $warehouse1 = $this->getReference(
            WarehouseFixtures::WAREHOUSE_1,
            Warehouse::class
        );

        $warehouse2 = $this->getReference(
            WarehouseFixtures::WAREHOUSE_2,
            Warehouse::class
        );

        // TRANSFER 1 - Pending transfer
        $transfer1 = new StockTransfer();

        $transfer1->setSourceWarehouse($warehouse1);
        $transfer1->setDestinationWarehouse($warehouse2);
        $transfer1->setUser($admin);
        $transfer1->setStatus('PENDING');
        $transfer1->setNotes('Transfer pending approval');

        $manager->persist($transfer1);


        // TRANSFER 2 - Completed transfer
        $transfer2 = new StockTransfer();

        $transfer2->setSourceWarehouse($warehouse2);
        $transfer2->setDestinationWarehouse($warehouse1);
        $transfer2->setUser($admin);
        $transfer2->setStatus('COMPLETED');
        $transfer2->setNotes('Transfer completed successfully');

        $manager->persist($transfer2);


        // TRANSFER 3 - Cancelled transfer
        $transfer3 = new StockTransfer();

        $transfer3->setSourceWarehouse($warehouse1);
        $transfer3->setDestinationWarehouse($warehouse2);
        $transfer3->setUser($admin);
        $transfer3->setStatus('CANCELLED');
        $transfer3->setNotes('Transfer cancelled');

        $manager->persist($transfer3);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            WarehouseFixtures::class,
        ];
    }
}
