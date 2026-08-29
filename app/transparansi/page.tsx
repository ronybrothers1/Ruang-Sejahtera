"use client";

import { motion } from 'motion/react';
import { Download, FileText, ArrowUpRight, BarChart3, PieChart, Activity } from 'lucide-react';
import Link from 'next/link';

export default function TransparansiPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 font-heading">Transparansi Keuangan & Program</h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Komitmen kami untuk menyajikan laporan yang jujur, terbuka, dan akuntabel kepada seluruh donatur, relawan, dan masyarakat.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-slate-900 font-heading">Ringkasan Keuangan 2026</h2>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5">
              <option>Tahun 2026</option>
              <option>Tahun 2025</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Penerimaan', value: 'Rp 2.150.000.000', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Penyaluran', value: 'Rp 1.840.000.000', icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Operasional', value: 'Rp 120.000.000', icon: PieChart, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Saldo Dialokasikan', value: 'Rp 190.000.000', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col gap-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 font-heading">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Laporan Lengkap */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 font-heading">Laporan Keuangan Bulanan</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Periode</th>
                    <th className="px-6 py-4 font-semibold">Penerimaan</th>
                    <th className="px-6 py-4 font-semibold">Penyaluran</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Dokumen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { month: 'Mei 2026', in: 'Rp 210.000.000', out: 'Rp 180.000.000', status: 'Terverifikasi' },
                    { month: 'April 2026', in: 'Rp 340.000.000', out: 'Rp 320.000.000', status: 'Terverifikasi' },
                    { month: 'Maret 2026', in: 'Rp 180.000.000', out: 'Rp 150.000.000', status: 'Terverifikasi' },
                    { month: 'Februari 2026', in: 'Rp 150.000.000', out: 'Rp 140.000.000', status: 'Terverifikasi' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.month}</td>
                      <td className="px-6 py-4 text-slate-600">{row.in}</td>
                      <td className="px-6 py-4 text-slate-600">{row.out}</td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                          <Download size={16} /> <span className="hidden sm:inline">Unduh PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
