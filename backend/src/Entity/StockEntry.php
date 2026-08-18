<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\StockEntryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: StockEntryRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['stock_entry_read']],
    denormalizationContext: ['groups' => ['stock_entry_write']],
    operations: [
        new GetCollection(),
        new Get(),
    ],
)]

class StockEntry
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['stock_entry_read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['stock_entry_read', 'stock_entry_write'])]
    private ?int $quantity = null;

    #[ORM\Column]
    #[Groups(['stock_entry_read', 'stock_entry_write'])]
    private ?\DateTime $dateStockEntry = null;

    #[ORM\ManyToOne(inversedBy: 'stockEntries')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['stock_entry_read'])]
    private ?Product $product = null;

    #[ORM\ManyToOne(inversedBy: 'stockEntries')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getDateStockEntry(): ?\DateTime
    {
        return $this->dateStockEntry;
    }

    public function setDateStockEntry(\DateTime $dateStockEntry): static
    {
        $this->dateStockEntry = $dateStockEntry;

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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
