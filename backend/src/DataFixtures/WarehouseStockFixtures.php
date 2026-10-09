<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\Entity\Warehouse;
use App\Entity\WarehouseStock;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class WarehouseStockFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Retrieve products and warehouses
        $product1 = $this->getReference(
            ProductFixtures::PRODUCT_KEYBOARD,
            Product::class
        );

        $product2 = $this->getReference(
            ProductFixtures::PRODUCT_DESK,
            Product::class
        );

        $warehouse1 = $this->getReference(
            WarehouseFixtures::WAREHOUSE_1,
            Warehouse::class
        );

        $warehouse2 = $this->getReference(
            WarehouseFixtures::WAREHOUSE_2,
            Warehouse::class
        );

        // STOCK 1 - Product 1 in the main warehouse
        $stock1 = new WarehouseStock();

        $stock1->setProduct($product1);
        $stock1->setWarehouse($warehouse1);
        $stock1->setQuantity(100);

        $manager->persist($stock1);


        // STOCK 2 - Product 2 in the main warehouse
        $stock2 = new WarehouseStock();

        $stock2->setProduct($product2);
        $stock2->setWarehouse($warehouse1);
        $stock2->setQuantity(50);

        $manager->persist($stock2);


        // STOCK 3 - Product 1 in the secondary warehouse
        $stock3 = new WarehouseStock();

        $stock3->setProduct($product1);
        $stock3->setWarehouse($warehouse2);
        $stock3->setQuantity(75);

        $manager->persist($stock3);


        // STOCK 4 - Product 2 in the secondary warehouse
        $stock4 = new WarehouseStock();

        $stock4->setProduct($product2);
        $stock4->setWarehouse($warehouse2);
        $stock4->setQuantity(30);

        $manager->persist($stock4);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ProductFixtures::class,
            WarehouseFixtures::class,
        ];
    }
}
