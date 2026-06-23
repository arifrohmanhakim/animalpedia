{/* replace the Ukuran section with this */}
  <div className="mt-5">
    <h3 className="font-display text-sm font-bold mb-2.5">⚖️ Berat</h3>
    <div className="crayon-card p-3.5 bg-[var(--paper)]">
      <div className="flex items-center gap-3">
        <div className="text-2xl">👤</div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <div className="h-3 bg-[var(--orange)] rounded-full" style={{ width: '60%' }} />
            <span className="text-[10px] font-bold">Manusia (~70 kg)</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="text-2xl">{animal.emoji}</div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <div className="h-4 bg-[var(--blue)] rounded-full" style={{ width: '85%' }} />
            <span className="text-[10px] font-bold">{animal.weight}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* rest after this unchanged */}