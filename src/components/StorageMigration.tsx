"use client";

import { useEffect } from "react";

import { migrateLocalStorage } from "~/libs/migrateStorage";

export default function StorageMigration() {
  useEffect(() => {
    migrateLocalStorage();
  }, []);

  return null;
}
