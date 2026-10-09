<?php

namespace App\DataFixtures;

use App\Entity\Warehouse;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class WarehouseFixtures extends Fixture
{
    public const WAREHOUSE_1 = 'warehouse_1';
    public const WAREHOUSE_2 = 'warehouse_2';
    public const WAREHOUSE_3 = 'warehouse_3';

    public function load(ObjectManager $manager): void
    {
        // WAREHOUSE 1 - Main warehouse
        $warehouse1 = new Warehouse();

        $warehouse1->setName('Main Warehouse');
        $warehouse1->setLocation('Lisbon, Portugal');
        $warehouse1->setActive(true);

        $manager->persist($warehouse1);

        $this->addReference(self::WAREHOUSE_1, $warehouse1);


        // WAREHOUSE 2 - Secondary warehouse
        $warehouse2 = new Warehouse();

        $warehouse2->setName('Secondary Warehouse');
        $warehouse2->setLocation('Porto, Portugal');
        $warehouse2->setActive(true);

        $manager->persist($warehouse2);

        $this->addReference(self::WAREHOUSE_2, $warehouse2);


        // WAREHOUSE 3 - Inactive warehouse
        $warehouse3 = new Warehouse();

        $warehouse3->setName('Inactive Warehouse');
        $warehouse3->setLocation('Coimbra, Portugal');
        $warehouse3->setActive(false);

        $manager->persist($warehouse3);

        $this->addReference(self::WAREHOUSE_3, $warehouse3);

        $manager->flush();
    }
}
