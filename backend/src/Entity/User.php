<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Put;

use App\Controller\Api\MeAction;
use App\Controller\Api\UpdateMeAction;

use App\Repository\UserRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['user_read']],
    denormalizationContext: ['groups' => ['user_write']],
    operations: [
        new GetCollection(
            security: 'is_granted("ROLE_ADMIN")',
        ),

        new Get(
            security: 'is_granted("ROLE_ADMIN")',
        ),

        new Get(
            uriTemplate: '/me',
            controller: MeAction::class,
            read: false,
            security: 'is_granted("ROLE_USER")',
            name: 'api_me',
        ),

        new Delete(
            security: 'is_granted("ROLE_ADMIN") and (object == user or not ("ROLE_ADMIN" in object.getRoles()))',
            securityMessage: 'Only administrators can delete non-administrator users.',
        ),

        new Put(
            uriTemplate: '/me',
            controller: UpdateMeAction::class,
            read: false,
            deserialize: false,
            security: 'is_granted("ROLE_USER")',
            name: 'api_me_update',
        ),
    ],
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user_read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_read', 'user_write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['user_read', 'user_write'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column]
    #[Groups(['user_read'])]
    private array $roles = [];

    #[ORM\Column(type: 'boolean')]
    #[Groups(['user_read', 'user_write'])]
    private ?bool $isActive = true;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['user_read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['user_read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    /**
     * User -> StockEntry
     *
     * @var Collection<int, StockEntry>
     */
    #[ORM\OneToMany(
        targetEntity: StockEntry::class,
        mappedBy: 'user'
    )]
    private Collection $stockEntries;

    /**
     * User -> StockExit
     *
     * @var Collection<int, StockExit>
     */
    #[ORM\OneToMany(
        targetEntity: StockExit::class,
        mappedBy: 'user'
    )]
    private Collection $stockExits;

    /**
     * User -> StockTransfer
     *
     * @var Collection<int, StockTransfer>
     */
    #[ORM\OneToMany(
        targetEntity: StockTransfer::class,
        mappedBy: 'user'
    )]
    private Collection $stockTransfers;

    /**
     * User -> AuditLog
     *
     * @var Collection<int, AuditLog>
     */
    #[ORM\OneToMany(
        targetEntity: AuditLog::class,
        mappedBy: 'user'
    )]
    private Collection $auditLogs;

    public function __construct()
    {
        $this->stockEntries = new ArrayCollection();
        $this->stockExits = new ArrayCollection();
        $this->stockTransfers = new ArrayCollection();
        $this->auditLogs = new ArrayCollection();

        $this->isActive = true;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
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

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function eraseCredentials(): void
    {
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;

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
            $stockEntry->setUser($this);
        }

        return $this;
    }

    public function removeStockEntry(StockEntry $stockEntry): static
    {
        if ($this->stockEntries->removeElement($stockEntry)) {
            if ($stockEntry->getUser() === $this) {
                $stockEntry->setUser(null);
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
            $stockExit->setUser($this);
        }

        return $this;
    }

    public function removeStockExit(StockExit $stockExit): static
    {
        if ($this->stockExits->removeElement($stockExit)) {
            if ($stockExit->getUser() === $this) {
                $stockExit->setUser(null);
            }
        }

        return $this;
    }

    /*
     * StockTransfer
     */

    /**
     * @return Collection<int, StockTransfer>
     */
    public function getStockTransfers(): Collection
    {
        return $this->stockTransfers;
    }

    public function addStockTransfer(StockTransfer $stockTransfer): static
    {
        if (!$this->stockTransfers->contains($stockTransfer)) {
            $this->stockTransfers->add($stockTransfer);
            $stockTransfer->setUser($this);
        }

        return $this;
    }

    public function removeStockTransfer(StockTransfer $stockTransfer): static
    {
        if ($this->stockTransfers->removeElement($stockTransfer)) {
            if ($stockTransfer->getUser() === $this) {
                $stockTransfer->setUser(null);
            }
        }

        return $this;
    }

    /*
     * AuditLog
     */

    /**
     * @return Collection<int, AuditLog>
     */
    public function getAuditLogs(): Collection
    {
        return $this->auditLogs;
    }

    public function addAuditLog(AuditLog $auditLog): static
    {
        if (!$this->auditLogs->contains($auditLog)) {
            $this->auditLogs->add($auditLog);
            $auditLog->setUser($this);
        }

        return $this;
    }

    public function removeAuditLog(AuditLog $auditLog): static
    {
        if ($this->auditLogs->removeElement($auditLog)) {
            if ($auditLog->getUser() === $this) {
                $auditLog->setUser(null);
            }
        }

        return $this;
    }
}
