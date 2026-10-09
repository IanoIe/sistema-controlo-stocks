<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\Entity\ProductSupplier;
use App\Entity\Supplier;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ProductSupplierFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Retrieve products and suppliers from existing fixtures
        $product1 = $this->getReference(
            ProductFixtures::PRODUCT_KEYBOARD,
            Product::class
        );

        $product2 = $this->getReference(
            ProductFixtures::PRODUCT_DESK,
            Product::class
        );

        $supplier1 = $this->getReference(
            SupplierFixtures::SUPPLIER_1,
            Supplier::class
        );

        $supplier2 = $this->getReference(
            SupplierFixtures::SUPPLIER_2,
            Supplier::class
        );

        // PRODUCT SUPPLIER 1 - Preferred supplier for product 1
        $productSupplier1 = new ProductSupplier();

        $productSupplier1->setProduct($product1);
        $productSupplier1->setSupplier($supplier1);
        $productSupplier1->setSupplierCode('SUP-001');
        $productSupplier1->setCostPrice('12.50');
        $productSupplier1->setIsPreferred(true);

        $manager->persist($productSupplier1);


        // PRODUCT SUPPLIER 2 - Alternative supplier for product 1
        $productSupplier2 = new ProductSupplier();

        $productSupplier2->setProduct($product1);
        $productSupplier2->setSupplier($supplier2);
        $productSupplier2->setSupplierCode('SUP-002');
        $productSupplier2->setCostPrice('13.75');
        $productSupplier2->setIsPreferred(false);

        $manager->persist($productSupplier2);


        // PRODUCT SUPPLIER 3 - Preferred supplier for product 2
        $productSupplier3 = new ProductSupplier();

        $productSupplier3->setProduct($product2);
        $productSupplier3->setSupplier($supplier2);
        $productSupplier3->setSupplierCode('SUP-003');
        $productSupplier3->setCostPrice('8.90');
        $productSupplier3->setIsPreferred(true);

        $manager->persist($productSupplier3);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ProductFixtures::class,
            SupplierFixtures::class,
        ];
    }
}
