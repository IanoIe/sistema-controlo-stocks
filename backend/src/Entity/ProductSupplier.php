<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'product_supplier')]
class ProductSupplier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $supplierCode = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $costPrice = null;

    #[ORM\Column]
    private bool $isPreferred = false;

    #[ORM\ManyToOne(inversedBy: 'productSuppliers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Product $product = null;

    #[ORM\ManyToOne(inversedBy: 'productSuppliers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Supplier $supplier = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSupplierCode(): ?string
    {
        return $this->supplierCode;
    }

    public function setSupplierCode(?string $supplierCode): static
    {
        $this->supplierCode = $supplierCode;

        return $this;
    }

    public function getCostPrice(): ?string
    {
        return $this->costPrice;
    }

    public function setCostPrice(string $costPrice): static
    {
        $this->costPrice = $costPrice;

        return $this;
    }

    public function isPreferred(): bool
    {
        return $this->isPreferred;
    }

    public function setIsPreferred(bool $isPreferred): static
    {
        $this->isPreferred = $isPreferred;

        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;

        return $this;
    }

    public function getSupplier(): ?Supplier
    {
        return $this->supplier;
    }

    public function setSupplier(?Supplier $supplier): static
    {
        $this->supplier = $supplier;

        return $this;
    }
}
