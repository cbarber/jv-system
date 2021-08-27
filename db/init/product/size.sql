CREATE TABLE product.product_size (
	id BIGSERIAL PRIMARY KEY,
	species_id TEXT,
	variety_id TEXT,
	jv_code TEXT,
	jv_description TEXT,
	shipper_code TEXT,
	shipper_description TEXT,
	combine_with TEXT,
	combine_description TEXT,
	shipper_id TEXT
);

CREATE FUNCTION product.product_size_shipper(IN s product.product_size)
    RETURNS directory.shipper
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.shipper sh WHERE sh.id = s.shipper_id
$BODY$;

CREATE FUNCTION product.product_size_species(IN s product.product_size)
    RETURNS product.product_species
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_species sp WHERE sp.id = s.species_id
$BODY$;

CREATE FUNCTION product.product_size_variety(IN s product.product_size)
    RETURNS product.product_variety
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM product.product_variety v WHERE v.id = s.variety_id
$BODY$;