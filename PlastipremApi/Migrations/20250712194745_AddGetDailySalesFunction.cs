using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValplasApi.Migrations
{
    /// <inheritdoc />
    public partial class AddGetDailySalesFunction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
create or replace function get_daily_sales_grouped_by_product(target_date date)
returns table (
    product_id uuid,
    product_name text,
    stock integer,
    cost_price numeric,
    list_price_id uuid,
    list_price_name text,
    total_quantity integer,
    total_revenue numeric,
    margin numeric
) as $$
begin
  return query

  select
    p.""ProductID"",
    p.""Name"" as product_name,
    p.""Quantity"",
    p.""CostPrice"",
    lp.""ListPriceID"",
    lp.""Name"" as list_price_name,
    sum(op.""Quantity"") as total_quantity,
    sum(op.""Revenue"") as total_revenue,
    lp.""Margin""
  from ""OrderProducts"" op
  inner join ""Orders"" o
    on o.""OrderID"" = op.""OrderID""
   and o.""OrderDate"" >= target_date
   and o.""OrderDate"" < target_date + interval '1 day'
   and not o.""IsDeleted""
  inner join ""Products"" p
    on p.""ProductID"" = op.""ProductID""
   and not p.""IsDeleted""
  inner join ""ListPrices"" lp
    on lp.""ListPriceID"" = op.""ListPriceID""
   and not lp.""IsDeleted""
  group by
    p.""ProductID"", p.""Name"", p.""Quantity"", p.""CostPrice"",
    lp.""ListPriceID"", lp.""Name"", lp.""Margin""
  order by p.""Name"";

end;
$$ language plpgsql;
    ");
        }


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("drop function if exists get_daily_sales_grouped_by_product(date);");
        }

    }
}
