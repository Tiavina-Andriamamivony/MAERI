-- Aligne les références déjà en base sur le format attribué automatiquement
-- (« 1 » -> « ART-0001 »), pour que la table ne mélange pas deux formats.
--
-- Seules les références purement numériques sont converties : une référence
-- fournisseur (« ROUL-6204 ») est laissée intacte. La garde `NOT EXISTS` évite
-- de violer l'index unique si la référence cible existe déjà.
UPDATE "Article" AS target
SET "reference" = 'ART-' || lpad(target."reference", 4, '0')
WHERE target."reference" ~ '^\d+$'
  AND NOT EXISTS (
    SELECT 1
    FROM "Article" AS existing
    WHERE existing."reference" = 'ART-' || lpad(target."reference", 4, '0')
  );
