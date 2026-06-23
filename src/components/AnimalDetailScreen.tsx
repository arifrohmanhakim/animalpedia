{/* existing code... */
  /* Find the section with the three cards and replace it */

  <div className="flex gap-2.5 mt-4">
    <div className="flex-1 crayon-card p-2.5 text-center bg-[var(--green-pale)]">
      <div className="text-xl">{animal.habitatEmoji}</div>
      <div className="text-[9px] font-bold text-[var(--green-deep)] mt-0.5 uppercase tracking-wider">Habitat</div>
      <div className="text-[10px] font-bold text-[var(--green-deep)] mt-0.5 leading-tight">{animal.habitat}</div>
    </div>
    <div className="flex-1 crayon-card p-2.5 text-center bg-[var(--red-pale)]">
      <div className="text-xl">{animal.foodEmoji}</div>
      <div className="text-[9px] font-bold text-[#A23F2C] mt-0.5 uppercase tracking-wider">Makanan</div>
      <div className="text-[10px] font-bold text-[#A23F2C] mt-0.5 leading-tight">{animal.food}</div>
    </div>
    <div className="flex-1 crayon-card p-2.5 text-center bg-[var(--blue-pale)]">
      <div className="text-xl">⏳</div>
      <div className="text-[9px] font-bold text-[var(--blue-deep)] mt-0.5 uppercase tracking-wider">Usia</div>
      <div className="text-[10px] font-bold text-[var(--blue-deep)] mt-0.5 leading-tight">{animal.lifespan}</div>
    </div>
  </div>
  /* ... rest of component unchanged */