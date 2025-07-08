using Microsoft.EntityFrameworkCore;
using Valplas.Models;

namespace Valplas.Data;

public class ValplasContext : DbContext
{
    // Propiedades DbSet
    public DbSet<ClientModel> Clients { get; set; }
    public DbSet<UserModel> Users { get; set; }
    public DbSet<ProductModel> Products { get; set; }

    public DbSet<OrderModel> Orders { get; set; }
    public DbSet<OrderProductModel> OrderProducts { get; set; }
    public DbSet<ListPriceModel> ListPrices { get; set; }

    // Constructor
    public ValplasContext(DbContextOptions<ValplasContext> options)
        : base(options)
    {
        // Inicialización de los DbSets
        Clients = Set<ClientModel>();
        Users = Set<UserModel>();
        Products = Set<ProductModel>();
        Orders = Set<OrderModel>();
        OrderProducts = Set<OrderProductModel>();
        ListPrices = Set<ListPriceModel>();
    }

    // Configuración del modelo
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserModel>(entity =>
        {
            // Índice único en Email
            entity.HasIndex(u => u.Email).IsUnique();
        });


        // Configuración de OrderModel
        modelBuilder.Entity<OrderModel>(entity =>
        {
            entity.HasKey(o => o.OrderID); // Clave primaria
            entity.Property(e => e.OrderDate).HasColumnType("timestamp with time zone");
            entity.Property(e => e.DeliveryDate).HasColumnType("timestamp with time zone");
            entity.Property(e => e.RealDeliveryDate).HasColumnType("timestamp with time zone");
            // Relación: Una orden tiene muchos OrderProducts
            entity.HasMany(o => o.OrderProducts)
                    .WithOne()
                    .HasForeignKey(op => op.OrderID)
                    .OnDelete(DeleteBehavior.Cascade); // Elimina los OrderProducts si se elimina una Order
        });

        // Configuración de ProductModel

        // Configuración de OrderProductModel (tabla de unión)
        modelBuilder.Entity<OrderProductModel>(entity =>
        {
            entity.HasKey(op => new { op.OrderID, op.ProductID }); // Clave compuesta
            entity.Property(op => op.Quantity).IsRequired();
            entity.Property(op => op.UnitaryPrice).IsRequired();
            entity.Property(op => op.Subtotal).IsRequired();


            entity.HasOne(op => op.Product) // Relación con ProductModel
                  .WithMany(p => p.OrderProducts)
                  .HasForeignKey(op => op.ProductID)
                    .OnDelete(DeleteBehavior.Restrict); // No permite eliminar un producto si está en uso

            entity.HasOne(op => op.Order)
                    .WithMany(o => o.OrderProducts)
                    .HasForeignKey(op => op.OrderID);

            entity.HasOne(op => op.ListPrice)
                .WithMany(lp => lp.OrderProducts)
                .HasForeignKey(op => op.ListPriceID);
        });

        modelBuilder.Entity<ProductModel>(entity =>
        {
            entity.HasKey(p => p.ProductID); // Asegúrate de que ProductID existe en el modelo
            entity.Property(p => p.Description);
            entity.HasMany(p => p.OrderProducts) // Relación muchos a muchos a través de OrderProductModel
                  .WithOne(op => op.Product)
                  .HasForeignKey(op => op.ProductID);
        });

        modelBuilder.Entity<ListPriceModel>(e =>
        {
            e.HasKey(p => p.ListPriceID);
            e.Property(p => p.Name);
        });
    }
}
