"use client";

import { useState } from 'react';
import { Heart, Shield, Lock, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function DonasiPage() {
  const [amount, setAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');

  const presetAmounts = [50000, 100000, 200000, 500000];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 font-heading">
            Salurkan Dukungan Anda
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Setiap donasi memiliki arti ketika sampai kepada mereka yang membutuhkan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Information */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
              <div className="relative h-60 w-full">
                <Image
                  src="https://picsum.photos/seed/kemanusiaan2/800/600"
                  alt="Kegiatan Bantuan"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">Program Kemanusiaan Terpadu</h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                  Donasi Anda akan disalurkan ke berbagai program prioritas kami termasuk Bantuan Sembako, Pendidikan, dan Tanggap Bencana.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <Shield size={16} />
                    </div>
                    <span>Terverifikasi dan dicatat dalam laporan transparansi.</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Lock size={16} />
                    </div>
                    <span>Transaksi aman menggunakan enkripsi standar industri.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">Pilih Nominal Donasi</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setAmount(preset);
                      setCustomAmount('');
                    }}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                      amount === preset
                        ? 'bg-red-50 border-red-600 text-red-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-red-300'
                    }`}
                  >
                    Rp {preset.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">Nominal Lainnya</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium">Rp</span>
                  </div>
                  <input
                    type="number"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Masukkan nominal"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(Number(e.target.value));
                    }}
                  />
                </div>
              </div>

              <hr className="border-slate-100 mb-8" />

              <h2 className="text-xl font-bold text-slate-900 mb-6 font-heading">Informasi Donatur</h2>
              
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-red-500 focus:border-red-500 outline-none" placeholder="Nama Anda" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-red-500 focus:border-red-500 outline-none" placeholder="email@contoh.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
                  <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-red-500 focus:border-red-500 outline-none" placeholder="0812xxxxxx" />
                </div>
                <div className="flex items-start gap-3 mt-4">
                  <input type="checkbox" id="anonim" className="mt-1 text-red-600 focus:ring-red-500 rounded border-slate-300" />
                  <label htmlFor="anonim" className="text-sm text-slate-600">Sembunyikan nama saya (Donasi Anonim)</label>
                </div>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20">
                Lanjutkan Pembayaran <ChevronRight size={20} />
              </button>
              
              <p className="text-center text-xs text-slate-500 mt-4">
                Dengan berdonasi, Anda menyetujui Kebijakan Donasi Yayasan Ruang Sejahtera.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
