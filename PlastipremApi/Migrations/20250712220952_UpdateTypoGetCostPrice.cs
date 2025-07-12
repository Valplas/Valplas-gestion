using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValplasApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTypoGetCostPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
    DROP FUNCTION IF EXISTS get_daily_sales_grouped_by_product(date);

    CREATE OR REPLACE FUNCTION get_daily_sales_grouped_by_product(target_date date)
    RETURNS TABLE (
        product_id uuid,
        product_name text,
        stock integer,
        cost_price numeric,
        list_price_id uuid,
        list_price_name text,
        total_quantity bigint,
        total_revenue numeric,
        margin numeric
    ) AS $$
    BEGIN
        RETURN QUERY
        SELECT
            p.""ProductID"",
            p.""Name"" AS product_name,
            p.""Quantity"" AS stock,
            op.""CostPrice"" AS cost_price, -- Cambiado de p.""CostPrice"" a op.""CostPrice""
            lp.""ListPriceID"",
            lp.""Name"" AS list_price_name,
            SUM(op.""Quantity"") AS total_quantity,
            SUM(op.""Revenue"") AS total_revenue,
            lp.""Margin""
        FROM ""OrderProducts"" op
        INNER JOIN ""Orders"" o
            ON o.""OrderID"" = op.""OrderID""
            AND o.""OrderDate"" >= target_date
            AND o.""OrderDate"" < target_date + INTERVAL '1 day'
            AND NOT o.""IsDeleted""
        INNER JOIN ""Products"" p
            ON p.""ProductID"" = op.""ProductID""
            AND NOT p.""IsDeleted""
        INNER JOIN ""ListPrices"" lp
            ON lp.""ListPriceID"" = op.""ListPriceID""
            AND NOT lp.""IsDeleted""
        GROUP BY
            p.""ProductID"", p.""Name"", p.""Quantity"", op.""CostPrice"", -- Ajustado para usar op.""CostPrice""
            lp.""ListPriceID"", lp.""Name"", lp.""Margin""
        ORDER BY p.""Name"";
    END;
    $$ LANGUAGE plpgsql;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
    DROP FUNCTION IF EXISTS get_daily_sales_grouped_by_product(date);");
        }
    }
}
