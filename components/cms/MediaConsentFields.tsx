export function MediaConsentFields({ required = false }: { required?: boolean }) {
  return (
    <fieldset className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
      <legend className="px-1 text-sm font-extrabold">Persetujuan dokumentasi</legend>
      <p className="mt-1 text-sm leading-6 text-neutral-600">Status ini dicatat bersama aset. Media tetap privat selama draft dan baru dapat dipublikasikan setelah persetujuannya valid.</p>
      <label className="mt-4 block text-sm font-bold">Dasar penggunaan media
        <select name="mediaConsentStatus" required={required} defaultValue="" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 font-normal">
          <option value="">Pilih status persetujuan</option>
          <option value="confirmed">Persetujuan pihak yang terdokumentasi sudah dikonfirmasi</option>
          <option value="not_required">Tidak memuat orang atau persetujuan tidak diperlukan</option>
        </select>
      </label>
      <label className="mt-4 flex items-start gap-3 text-sm leading-6">
        <input name="containsVulnerablePerson" value="yes" type="checkbox" className="mt-1 size-4 shrink-0" />
        <span>Media memuat anak, penerima bantuan, atau pihak rentan lainnya. Jika dipilih, persetujuan terkonfirmasi wajib tersedia.</span>
      </label>
    </fieldset>
  );
}
