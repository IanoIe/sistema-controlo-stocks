<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['product_read']],
    denormalizationContext: ['groups' => ['product_write']],
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
    ],
)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['product_read', 'stock_entry_read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['product_read', 'product_write', 'stock_entry_read', 'stock_exit_read'])]
    private ?string $nameProduct = null;

    #[ORM\Column(length: 255)]
    #[Groups(['product_read', 'product_write', 'stock_entry_read'])]
    private ?string $codeProduct = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Groups(['product_read', 'product_write'])]
    private ?string $price = null;

    #[ORM\Column]
    #[Groups(['product_read', 'product_write'])]
    private ?int $quantity = null;

    #[ORM\Column]
    #[Groups(['product_read', 'product_write'])]
    private ?int $stockMin = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['product_read', 'product_write'])]
    private ?Category $category = null;

    /**
     * @var Collection<int, StockEntry>
     */
    #[ORM\OneToMany(
        targetEntity: StockEntry::class,
        mappedBy: 'product'
    )]
    private Collection $stockEntries;

    /**
     * @var Collection<int, StockExit>
     */
    #[ORM\OneToMany(
        targetEntity: StockExit::class,
        mappedBy: 'product'
    )]
    private Collection $stockExits;

    public function __construct()
    {
        $this->stockEntries = new ArrayCollection();
        $this->stockExits = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNameProduct(): ?string
    {
        return $this->nameProduct;
    }

    public function setNameProduct(string $nameProduct): static
    {
        $this->nameProduct = $nameProduct;

        return $this;
    }

    public function getCodeProduct(): ?string
    {
        return $this->codeProduct;
    }

    public function setCodeProduct(string $codeProduct): static
    {
        $this->codeProduct = $codeProduct;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
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

    public function getStockMin(): ?int
    {
        return $this->stockMin;
    }

    public function setStockMin(int $stockMin): static
    {
        $this->stockMin = $stockMin;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection<int, StockEntry>
     */
    public function getStockEntries(): Collection
    {
        return $this->stockEntries;
    }

    public function addStockEntry(StockEntry $stockEntry): static
    {
        if (!$this->stockEntries->contains($stockEntry)) {
            $this->stockEntries->add($stockEntry);
            $stockEntry->setProduct($this);
        }

        return $this;
    }

    public function removeStockEntry(StockEntry $stockEntry): static
    {
        if ($this->stockEntries->removeElement($stockEntry)) {
            if ($stockEntry->getProduct() === $this) {
                $stockEntry->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, StockExit>
     */
    public function getStockExits(): Collection
    {
        return $this->stockExits;
    }

    public function addStockExit(StockExit $stockExit): static
    {
        if (!$this->stockExits->contains($stockExit)) {
            $this->stockExits->add($stockExit);
            $stockExit->setProduct($this);
        }

        return $this;
    }

    public function removeStockExit(StockExit $stockExit): static
    {
        if ($this->stockExits->removeElement($stockExit)) {
            if ($stockExit->getProduct() === $this) {
                $stockExit->setProduct(null);
            }
        }

        return $this;
    }
}
