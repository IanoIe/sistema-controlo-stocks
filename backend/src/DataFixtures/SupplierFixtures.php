<?php

namespace App\DataFixtures;

use App\Entity\Supplier;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class SupplierFixtures extends Fixture
{
    public const SUPPLIER_1 = 'supplier_1';
    public const SUPPLIER_2 = 'supplier_2';
    public const SUPPLIER_3 = 'supplier_3';

    public function load(ObjectManager $manager): void
    {
        // SUPPLIER 1 - Main supplier
        $supplier1 = new Supplier();

        $supplier1->setName('Global Supplies');
        $supplier1->setEmail('global@example.com');
        $supplier1->setPhone('+351 210 000 001');
        $supplier1->setAddress('Lisbon, Portugal');
        $supplier1->setTaxNumber('PT123456789');
        $supplier1->setActive(true);

        $manager->persist($supplier1);

        $this->addReference(self::SUPPLIER_1, $supplier1);


        // SUPPLIER 2 - Alternative supplier
        $supplier2 = new Supplier();

        $supplier2->setName('Industrial Partners');
        $supplier2->setEmail('industrial@example.com');
        $supplier2->setPhone('+351 220 000 002');
        $supplier2->setAddress('Porto, Portugal');
        $supplier2->setTaxNumber('PT987654321');
        $supplier2->setActive(true);

        $manager->persist($supplier2);

        $this->addReference(self::SUPPLIER_2, $supplier2);


        // SUPPLIER 3 - Inactive supplier
        $supplier3 = new Supplier();

        $supplier3->setName('Legacy Suppliers');
        $supplier3->setEmail('legacy@example.com');
        $supplier3->setPhone('+351 230 000 003');
        $supplier3->setAddress('Coimbra, Portugal');
        $supplier3->setTaxNumber('PT456789123');
        $supplier3->setActive(false);

        $manager->persist($supplier3);

        $this->addReference(self::SUPPLIER_3, $supplier3);

        $manager->flush();
    }
}
