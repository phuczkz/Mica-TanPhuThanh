import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../admin/AdminNavbar'; // Tạm thời dùng lại component cũ, sẽ refactor sau

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNavbar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-brand-navy">Quản Trị Hệ Thống</h1>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
