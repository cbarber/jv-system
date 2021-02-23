CREATE TABLE chile_departure_inspection_pallet (
	id TEXT PRIMARY KEY,
	lot_id TEXT NOT NULL,
	lot_number TEXT NOT NULL,
	location_name TEXT NOT NULL,
	shipper TEXT NOT NULL,
	inspection_date date NOT NULL,
	product_name TEXT NOT NULL,
	packing_type TEXT NOT NULL,
	product_type TEXT NOT NULL,
	pallet_count NUMERIC NOT NULL,
	supervisor TEXT NOT NULL,
	pallet_number TEXT NOT NULL,
	boxes_count NUMERIC NOT NULL,
	net_weight NUMERIC NOT NULL,
	grower TEXT NOT NULL,
	size TEXT NOT NULL,
	variety TEXT NOT NULL,
	packing_date date NOT NULL,
	label TEXT NOT NULL,
	temperature TEXT NOT NULL,
	open_appearance TEXT NOT NULL,
	color TEXT NOT NULL,
	stem TEXT NOT NULL,
	texture TEXT NOT NULL,
	bunches_count NUMERIC NOT NULL,
	brix NUMERIC NOT NULL,
	diameter_min NUMERIC NOT NULL,
	diameter_max NUMERIC NOT NULL,
	straggly_tight_pct NUMERIC NOT NULL,
	surface_disc_pct NUMERIC NOT NULL,
	russet_scars_pct NUMERIC NOT NULL,
	sunburn_pct NUMERIC NOT NULL,
	undersized_bunches_pct NUMERIC NOT NULL,
	other_defects_pct NUMERIC NOT NULL,
	stem_dehy_pct NUMERIC NOT NULL,
	glassy_weak_pct NUMERIC NOT NULL,
	decay_pct NUMERIC NOT NULL,
	split_crushed_pct NUMERIC NOT NULL,
	dry_split_pct NUMERIC NOT NULL,
	wet_sticky_pct NUMERIC NOT NULL,
	waterberries_pct NUMERIC NOT NULL,
	shatter_pct NUMERIC NOT NULL,
	total_quality_defects_pct NUMERIC NOT NULL,
	total_condition_defects_pct NUMERIC NOT NULL,
	quality_score NUMERIC NOT NULL,
	condition_score NUMERIC NOT NULL,
	score_name TEXT NOT NULL,
	report_link TEXT NOT NULL,
	images_link TEXT NOT NULL
);
