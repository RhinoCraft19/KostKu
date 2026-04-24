-- Mengaktifkan RLS untuk semua tabel
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Room" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Complaint" ENABLE ROW LEVEL SECURITY;

-- Policy Property: User hanya bisa akses propertinya sendiri
CREATE POLICY "owner_properties" ON "Property" FOR ALL USING ("ownerId" = auth.uid()::text);

-- Policy Room: Cek via relasi Property
CREATE POLICY "owner_rooms" ON "Room" FOR ALL USING (
  "propertyId" IN (SELECT id FROM "Property" WHERE "ownerId" = auth.uid()::text)
);

-- Policy Tenant: Cek via relasi Room -> Property
CREATE POLICY "owner_tenants" ON "Tenant" FOR ALL USING (
  "roomId" IN (
    SELECT id FROM "Room" WHERE "propertyId" IN (
      SELECT id FROM "Property" WHERE "ownerId" = auth.uid()::text
    )
  )
);

-- Policy Payment: Cek via relasi Tenant -> Room -> Property
CREATE POLICY "owner_payments" ON "Payment" FOR ALL USING (
  "tenantId" IN (
    SELECT id FROM "Tenant" WHERE "roomId" IN (
      SELECT id FROM "Room" WHERE "propertyId" IN (
        SELECT id FROM "Property" WHERE "ownerId" = auth.uid()::text
      )
    )
  )
);

-- Policy Complaint: Publik bisa insert (tanpa auth), Owner bisa update/select
CREATE POLICY "public_insert_complaints" ON "Complaint" FOR INSERT WITH CHECK (true);
CREATE POLICY "owner_read_complaints" ON "Complaint" FOR SELECT USING (
  "propertyId" IN (SELECT id FROM "Property" WHERE "ownerId" = auth.uid()::text)
);
CREATE POLICY "owner_update_complaints" ON "Complaint" FOR UPDATE USING (
  "propertyId" IN (SELECT id FROM "Property" WHERE "ownerId" = auth.uid()::text)
);
