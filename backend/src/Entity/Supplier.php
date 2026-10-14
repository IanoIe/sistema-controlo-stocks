<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['supplier:read']]
        ),
        new Get(
            normalizationContext: ['groups' => ['supplier:read']]
        ),
        new Post(
            normalizationContext: ['groups' => ['supplier:read']],
            denormalizationContext: ['groups' => ['supplier:write']]
        ),
        new Patch(
            normalizationContext: ['groups' => ['supplier:read']],
            denormalizationContext: ['groups' => ['supplier:write']]
        ),
    ]
)]
#[ORM\Entity]
#[ORM\Table(name: 'supplier')]
class Supplier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['supplier:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['supplier:read', 'supplier:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['supplier:read', 'supplier:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['supplier:read', 'supplier:write'])]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['supplier:read', 'supplier:write'])]
    private ?string $address = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['supplier:read', 'supplier:write'])]
    private ?string $taxNumber = null;

    #[ORM\Column]
    #[Groups(['supplier:read', 'supplier:write'])]
    private bool $active = true;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Groups(['supplier:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Groups(['supplier:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    /**
     * @var Collection<int, ProductSupplier>
     */
    #[ORM\OneToMany(
        targetEntity: ProductSupplier::class,
        mappedBy: 'supplier'
    )]
    private Collection $productSuppliers;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();

        $this->productSuppliers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getTaxNumber(): ?string
    {
        return $this->taxNumber;
    }

    public function setTaxNumber(?string $taxNumber): static
    {
        $this->taxNumber = $taxNumber;

        return $this;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): static
    {
        $this->active = $active;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, ProductSupplier>
     */
    public function getProductSuppliers(): Collection
    {
        return $this->productSuppliers;
    }

    public function addProductSupplier(
        ProductSupplier $productSupplier
    ): static {
        if (!$this->productSuppliers->contains($productSupplier)) {
            $this->productSuppliers->add($productSupplier);
            $productSupplier->setSupplier($this);
        }

        return $this;
    }

    public function removeProductSupplier(
        ProductSupplier $productSupplier
    ): static {
        if ($this->productSuppliers->removeElement($productSupplier)) {
            if ($productSupplier->getSupplier() === $this) {
                $productSupplier->setSupplier(null);
            }
        }

        return $this;
    }
}
