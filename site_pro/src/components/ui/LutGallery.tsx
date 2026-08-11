import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import fileSaverPkg from "file-saver";
const { saveAs } = fileSaverPkg;
import { Check, Download, Expand, X } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { HoldToConfirm } from "./hold-to-confirm";
import { motion, AnimatePresence } from "motion/react";

type LutItem = {
  name: string;
  title: string;
  desc: string;
};

type Category = {
  id: string;
  title: string;
  luts: LutItem[];
};

interface LutGalleryProps {
  categories: Category[];
}

export default function LutGallery({ categories }: LutGalleryProps) {
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedLuts, setSelectedLuts] = useState<Set<string>>(new Set());
  const [activeLut, setActiveLut] = useState<{ lut: LutItem; catId: string } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 150);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSelection = (lutName: string) => {
    const newSelected = new Set(selectedLuts);
    if (newSelected.has(lutName)) {
      newSelected.delete(lutName);
    } else {
      newSelected.add(lutName);
    }
    setSelectedLuts(newSelected);
  };

  const handleCardClick = (lut: LutItem, catId: string) => {
    if (isMultiSelect) {
      toggleSelection(lut.name);
    } else {
      setActiveLut({ lut, catId });
    }
  };

  const downloadSelectedAsZip = async () => {
    if (selectedLuts.size === 0) return;
    setIsDownloading(true);
    
    try {
      const zip = new JSZip();
      
      // Find all selected LUTs across categories
      for (const cat of categories) {
        for (const lut of cat.luts) {
          if (selectedLuts.has(lut.name)) {
            // Fetch the .cube file
            const response = await fetch(`/luts/${cat.id}/${lut.name}.cube`);
            const blob = await response.blob();
            zip.file(`${lut.name}.cube`, blob);
          }
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "altn_luts.zip");
      
      // Reset selection
      setIsMultiSelect(false);
      setSelectedLuts(new Set());
    } catch (error) {
      console.error("Failed to generate zip", error);
      alert("Failed to download ZIP file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-10">
      <AnimatePresence>
        {isScrolled && (
          <motion.div 
            initial={{ y: -100, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: -100, opacity: 0, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-6 left-1/2 z-50 flex items-center gap-4 p-2 px-4 bg-black/60 backdrop-blur-xl border border-sayso-yellow/20 rounded-full shadow-2xl"
          >
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-sayso-yellow"
                checked={isMultiSelect}
                onChange={(e) => {
                  setIsMultiSelect(e.target.checked);
                  if (!e.target.checked) setSelectedLuts(new Set());
                }}
              />
              <span className="text-white font-bold text-sm whitespace-nowrap">
                {isMultiSelect ? `${selectedLuts.size} Selected` : "Select Multiple"}
              </span>
            </label>
            
            <AnimatePresence>
              {isMultiSelect && (
                <motion.div
                  initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                  animate={{ width: "auto", opacity: 1, marginLeft: 8 }}
                  exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                  className="overflow-hidden"
                >
                  <HoldToConfirm
                    onConfirm={downloadSelectedAsZip}
                    disabled={selectedLuts.size === 0 || isDownloading}
                    confirmLabel="Downloaded"
                  >
                    {isDownloading ? "Zipping..." : "Download"}
                  </HoldToConfirm>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      {categories.map((cat) => (
        <section key={cat.id} id={cat.id} className="scroll-mt-32">
          <div className="category-header">{cat.title}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.luts.map((lut) => {
              const isSelected = selectedLuts.has(lut.name);
              
              return (
                <div 
                  key={lut.name}
                  onClick={() => handleCardClick(lut, cat.id)}
                  className={`lut-card relative cursor-pointer group ${
                    isMultiSelect && isSelected ? "!border-sayso-yellow bg-sayso-yellow/10" : ""
                  }`}
                >
                  {isMultiSelect && (
                    <div className={`absolute top-2 right-2 z-20 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "bg-sayso-yellow border-sayso-yellow text-black" : "border-sayso-text/30 bg-sayso-background/50"
                    }`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  )}

                  {!isMultiSelect && (
                    <div className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-sayso-background/50 text-sayso-text flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Expand size={16} />
                    </div>
                  )}

                  <div className="mb-3 w-full pointer-events-none">
                    <BeforeAfterSlider
                      beforeImage="/previews/color_base.jpg"
                      afterImage={`/previews/${lut.name}.jpg`}
                      beforeAlt="Original"
                      afterAlt={lut.title}
                    />
                  </div>
                  <div className="font-bold text-sm text-sayso-text">{lut.title}</div>
                  <div className="text-xs text-sayso-text/50 mt-0.5">{lut.name}.cube</div>
                  <p className="m-0 mt-2 text-sm text-sayso-text/60 leading-snug">{lut.desc}</p>
                  
                  {!isMultiSelect && (
                    <a
                      href={`/luts/${cat.id}/${lut.name}.cube`}
                      download={`${lut.name}.cube`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block mt-3 px-3 py-1.5 rounded-lg border border-sayso-yellow/20 text-sayso-yellow text-xs font-bold no-underline hover:bg-sayso-yellow/10 transition-colors"
                    >
                      download
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Expanded Modal */}
      {activeLut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sayso-text/80 backdrop-blur-sm" onClick={() => setActiveLut(null)}>
          <div 
            className="relative w-full max-w-5xl bg-sayso-background border border-sayso-text/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveLut(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-sayso-background/50 hover:bg-sayso-yellow text-sayso-text hover:text-black rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="w-full md:w-2/3 bg-black">
              <BeforeAfterSlider
                beforeImage="/previews/color_base.jpg"
                afterImage={`/previews/${activeLut.lut.name}.jpg`}
                beforeAlt="Original"
                afterAlt={activeLut.lut.title}
                className="!rounded-none h-full"
              />
            </div>
            
            <div className="w-full md:w-1/3 p-8 flex flex-col justify-center bg-sayso-background">
              <div className="text-sayso-text/50 font-mono text-sm mb-2">{activeLut.lut.name}.cube</div>
              <h2 className="text-3xl font-display font-bold text-sayso-gold mb-4 leading-tight">{activeLut.lut.title}</h2>
              <p className="text-sayso-text/70 text-lg leading-relaxed mb-8">{activeLut.lut.desc}</p>
              
              <a
                href={`/luts/${activeLut.catId}/${activeLut.lut.name}.cube`}
                download={`${activeLut.lut.name}.cube`}
                className="w-full py-4 bg-sayso-yellow text-[#16150f] text-center font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                Download LUT <Download size={20} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
