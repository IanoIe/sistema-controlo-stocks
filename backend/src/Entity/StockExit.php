<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\StockExitRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;


#[ORM\Entity(repositoryClass: StockExitRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['stock_exit_read']],
    denormalizationContext: ['groups' => ['stock_exit_write']],
    operations: [
        new GetCollection(),
        new Get(),
    ]
)]

class StockExit
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['stock_exit_read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['stock_exit_read', 'stock_exit_wwrite'])]
    private ?int $quantity = null;

    #[ORM\Column]
    #[Groups(['stock_exit_read', 'stock_exit_write'])]
    private ?\DateTime $dateStockExit = null;

    #[ORM\ManyToOne(inversedBy: 'stockExits')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['stock_exit_read'])]
    private ?Product $product = null;

    #[ORM\ManyToOne(inversedBy: 'stockExits')]
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

    public function getDateStockExit(): ?\DateTime
    {
        return $this->dateStockExit;
    }

    public function setDateStockExit(\DateTime $dateStockExit): static
    {
        $this->dateStockExit = $dateStockExit;

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
