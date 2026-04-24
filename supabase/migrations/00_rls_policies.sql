-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Room" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Complaint" ENABLE ROW LEVEL SECURITY;

-- 1. User
-- User can only read and update their own data
CREATE POLICY "Users can view own data" ON "User" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON "User" FOR UPDATE USING (auth.uid() = id);

-- 2. Subscription
CREATE POLICY "Users can view own subscription" ON "Subscription" FOR SELECT USING (auth.uid() = "userId");

-- 3. Property
CREATE POLICY "Users can manage own properties" ON "Property" 
  FOR ALL USING (auth.uid() = "ownerId");

-- 4. Room
CREATE POLICY "Users can manage rooms of their properties" ON "Room" 
  FOR ALL USING (
    "propertyId" IN (SELECT id FROM "Property" WHERE "ownerId" = auth.uid())
  );

-- 5. Tenant
CREATE POLICY "Users can manage tenants of their properties" ON "Tenant" 
  FOR ALL USING (
    "roomId" IN (
      SELECT id FROM "Room" WHERE "propertyId" IN (
        SELECT id FROM "Property" WHERE "ownerId" = auth.uid()
      )
    )
  );

-- 6. Payment
CREATE POLICY "Users can manage payments of their tenants" ON "Payment" 
  FOR ALL USING (
    "tenantId" IN (
      SELECT id FROM "Tenant" WHERE "roomId" IN (
        SELECT id FROM "Room" WHERE "propertyId" IN (
          SELECT id FROM "Property" WHERE "ownerId" = auth.uid()
        )
      )
    )
  );

-- 7. Complaint
-- Public can INSERT complaints using public form
CREATE POLICY "Public can insert complaints" ON "Complaint" 
  FOR INSERT WITH CHECK (true);

-- Owners can SELECT/UPDATE their own complaints
CREATE POLICY "Users can view complaints of their properties" ON "Complaint" 
  FOR SELECT USING (
    "propertyId" IN (SELECT id FROM "Property" WHERE "ownerId" = auth.uid())
  );

CREATE POLICY "Users can update complaints of their properties" ON "Complaint" 
  FOR UPDATE USING (
    "propertyId" IN (SELECT id FROM "Property" WHERE "ownerId" = auth.uid())
  );
CREATE POLICY "Users can delete complaints of their properties" ON "Complaint" 
  FOR DELETE USING (
    "propertyId" IN (SELECT id FROM "Property" WHERE "ownerId" = auth.uid())
  );
