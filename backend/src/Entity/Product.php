<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
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
        new Put(),
        new Patch(),
        new Delete(),
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
    #[Groups([
        'product_read',
        'product_write',
        'stock_entry_read',
        'stock_exit_read'
    ])]
    private ?string $nameProduct = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups([
        'product_read',
        'product_write',
        'stock_entry_read'
    ])]
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

    #[ORM\Column(type: 'boolean')]
    #[Groups(['product_read', 'product_write'])]
    private ?bool $active = true;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['product_read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['product_read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    /*
     * Product -> Category
     * Muitos produtos pertencem a uma categoria.
     */
    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['product_read', 'product_write'])]
    private ?Category $category = null;

    /*
     * Product -> StockEntry
     */
    /**
     * @var Collection<int, StockEntry>
     */
    #[ORM\OneToMany(
        targetEntity: StockEntry::class,
        mappedBy: 'product'
    )]
    private Collection $stockEntries;

    /*
     * Product -> StockExit
     */
    /**
     * @var Collection<int, StockExit>
     */
    #[ORM\OneToMany(
        targetEntity: StockExit::class,
        mappedBy: 'product'
    )]
    private Collection $stockExits;

    /*
     * Product -> ProductSupplier
     */
    /**
     * @var Collection<int, ProductSupplier>
     */
    #[ORM\OneToMany(
        targetEntity: ProductSupplier::class,
        mappedBy: 'product'
    )]
    private Collection $productSuppliers;

    /*
     * Product -> WarehouseStock
     */
    /**
     * @var Collection<int, WarehouseStock>
     */
    #[ORM\OneToMany(
        targetEntity: WarehouseStock::class,
        mappedBy: 'product'
    )]
    private Collection $warehouseStocks;

    /*
     * Product -> StockTransferItem
     */
    /**
     * @var Collection<int, StockTransferItem>
     */
    #[ORM\OneToMany(
        targetEntity: StockTransferItem::class,
        mappedBy: 'product'
    )]
    private Collection $stockTransferItems;

    public function __construct()
    {
        $this->stockEntries = new ArrayCollection();
        $this->stockExits = new ArrayCollection();
        $this->productSuppliers = new ArrayCollection();
        $this->warehouseStocks = new ArrayCollection();
        $this->stockTransferItems = new ArrayCollection();

        $this->active = true;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
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

    public function isActive(): ?bool
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

    /*
     * Category
     */

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    /*
     * StockEntry
     */

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

    /*
     * StockExit
     */

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

    /*
     * ProductSupplier
     */

    /**
     * @return Collection<int, ProductSupplier>
     */
    public function getProductSuppliers(): Collection
    {
        return $this->productSuppliers;
    }

    public function addProductSupplier(ProductSupplier $productSupplier): static
    {
        if (!$this->productSuppliers->contains($productSupplier)) {
            $this->productSuppliers->add($productSupplier);
            $productSupplier->setProduct($this);
        }

        return $this;
    }

    public function removeProductSupplier(ProductSupplier $productSupplier): static
    {
        $this->productSuppliers->removeElement($productSupplier);

        return $this;
    }

    /*
     * WarehouseStock
     */

    /**
     * @return Collection<int, WarehouseStock>
     */
    public function getWarehouseStocks(): Collection
    {
        return $this->warehouseStocks;
    }

    public function addWarehouseStock(WarehouseStock $warehouseStock): static
    {
        if (!$this->warehouseStocks->contains($warehouseStock)) {
            $this->warehouseStocks->add($warehouseStock);
            $warehouseStock->setProduct($this);
        }

        return $this;
    }

    public function removeWarehouseStock(WarehouseStock $warehouseStock): static
    {
        $this->warehouseStocks->removeElement($warehouseStock);

        return $this;
    }

    /*
     * StockTransferItem
     */

    /**
     * @return Collection<int, StockTransferItem>
     */
    public function getStockTransferItems(): Collection
    {
        return $this->stockTransferItems;
    }

    public function addStockTransferItem(
        StockTransferItem $stockTransferItem
    ): static {
        if (!$this->stockTransferItems->contains($stockTransferItem)) {
            $this->stockTransferItems->add($stockTransferItem);
            $stockTransferItem->setProduct($this);
        }

        return $this;
    }

    public function removeStockTransferItem(
        StockTransferItem $stockTransferItem
    ): static {
        $this->stockTransferItems->removeElement($stockTransferItem);

        return $this;
    }
}
