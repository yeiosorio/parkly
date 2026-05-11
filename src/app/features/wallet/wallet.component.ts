import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white font-sans text-slate-800 flex justify-center">
      <!-- Contenedor Móvil Simulado -->
      <div class="w-full max-w-[480px] bg-davi-gray-50 min-h-screen flex flex-col relative shadow-2xl overflow-hidden">
        
        <!-- Header -->
        <header class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <button class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 hover:bg-slate-100 transition-colors">
            <!-- User Icon -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-davi-red">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          
          <div class="flex flex-col items-center mt-1">
            <!-- Logo Re-refinado -->
            <div class="flex items-center gap-1.5 relative">
               <!-- House roof icon -->
               <svg class="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[46px] h-3 text-davi-red" viewBox="0 0 46 12">
                  <path d="M 2 10 L 23 2 L 44 10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
              <span class="text-davi-red font-bold text-2xl tracking-tighter leading-none italic uppercase">PARKLY</span>
            </div>
          </div>
          
          <div class="flex gap-4">
            <button class="text-slate-600 hover:text-davi-red transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            <button class="text-slate-600 hover:text-davi-red transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
                <circle cx="16" cy="10" r="1" fill="currentColor"></circle>
                <circle cx="8" cy="10" r="1" fill="currentColor"></circle>
              </svg>
            </button>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 px-4 py-10 flex flex-col items-center gap-10">
          
          <!-- Tabs Re-refinado -->
          <div class="bg-slate-200/60 p-[3px] rounded-full flex w-[85%] max-w-[340px] shadow-inner">
            <button class="flex-1 py-2.5 px-4 rounded-full bg-davi-gradient text-white text-[15px] font-bold transition-all shadow-md">
              Mi Wallet
            </button>
            <button class="flex-1 py-2.5 px-4 rounded-full text-slate-500 text-[15px] font-semibold transition-all">
              Mi Negocio
            </button>
          </div>

          <!-- Balance Re-refinado -->
          <div class="text-center flex flex-col items-center">
            <h2 class="text-slate-500 text-[18px] font-normal mb-1">¿Cuánta Plata tengo?</h2>
            <div class="flex items-center gap-2">
              <div class="text-[38px] font-bold text-slate-800 tracking-tight">
                $18.813,<span class="text-[24px] align-top mt-1.5 inline-block">16</span>
              </div>
              <button class="text-slate-400 hover:text-slate-600 mb-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7">
                   <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                   <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <button class="text-davi-red font-bold text-[15px] mt-1 hover:underline">Ver más</button>
          </div>

          <!-- Quick Actions Re-refinado -->
          <div class="grid grid-cols-4 gap-6 w-full px-2 mt-4">
            <div class="flex flex-col items-center gap-3">
              <button class="w-[68px] h-[68px] rounded-full bg-davi-gradient text-white flex items-center justify-center shadow-xl shadow-davi-red/25 active:scale-95 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
                  <line x1="12" y1="4" x2="12" y2="20"></line>
                  <polyline points="19 13 12 20 5 13"></polyline>
                </svg>
              </button>
              <span class="text-[14px] font-semibold text-slate-600">Meter</span>
            </div>
            <div class="flex flex-col items-center gap-3">
              <button class="w-[68px] h-[68px] rounded-full bg-davi-gradient text-white flex items-center justify-center shadow-xl shadow-davi-red/25 active:scale-95 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <polyline points="13 5 20 12 13 19"></polyline>
                </svg>
              </button>
              <span class="text-[14px] font-semibold text-slate-600">Pasar</span>
            </div>
            <div class="flex flex-col items-center gap-3">
              <button class="w-[68px] h-[68px] rounded-full bg-davi-gradient text-white flex items-center justify-center shadow-xl shadow-davi-red/25 active:scale-95 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <polyline points="5 11 12 4 19 11"></polyline>
                </svg>
              </button>
              <span class="text-[14px] font-semibold text-slate-600">Sacar</span>
            </div>
            <div class="flex flex-col items-center gap-3">
              <button class="w-[68px] h-[68px] rounded-full bg-white text-davi-red flex items-center justify-center shadow-xl border border-slate-100 active:scale-95 transition-all hover:bg-slate-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-9 h-9">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span class="text-[14px] font-semibold text-slate-600">Más</span>
            </div>
          </div>

          <!-- Cards Carousel Re-refinado -->
          <div class="w-full mt-6 overflow-hidden">
            <div class="flex gap-5 px-4 pb-8 overflow-x-auto no-scrollbar scroll-smooth">
              
              <!-- Card 1 -->
              <div class="min-w-[260px] flex-shrink-0 bg-white rounded-[32px] shadow-xl shadow-slate-200 border border-slate-50 overflow-hidden group hover:scale-[1.02] transition-transform">
                <div class="h-36 bg-davi-gradient relative overflow-hidden">
                  <!-- Imagen posicionada a la derecha, ocupando el alto perfecto -->
                  <img src="/assets/davi_bolsillos.png" 
                       alt="Bolsillos" class="absolute bottom-0 right-0 h-full w-[70%] object-cover object-center translate-x-4">
                  <div class="absolute inset-0 bg-gradient-to-r from-davi-red via-davi-red/40 to-transparent"></div>
                  <div class="absolute bottom-5 left-5 text-white font-bold text-[20px] leading-tight drop-shadow-md">Mis Ahorros</div>
                </div>
                <div class="p-5 h-[100px] flex flex-col justify-center">
                  <p class="text-[14px] text-slate-500 leading-snug">Ahorra, consulta y consulta tus intereses</p>
                </div>
              </div>

              <!-- Card 2 -->
              <div class="min-w-[260px] flex-shrink-0 bg-white rounded-[32px] shadow-xl shadow-slate-200 border border-slate-50 overflow-hidden relative group hover:scale-[1.02] transition-transform">
                <div class="absolute top-4 right-4 z-10">
                  <span class="bg-white text-davi-red text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-lg">Nuevo</span>
                </div>
                <div class="h-36 bg-davi-gradient relative overflow-hidden">
                  <!-- Imagen posicionada a la derecha -->
                  <img src="/assets/davi_debito.png" 
                       alt="Tarjeta Débito" class="absolute bottom-0 right-0 h-full w-[70%] object-cover object-center translate-x-4">
                  <div class="absolute inset-0 bg-gradient-to-r from-davi-pink via-davi-pink/40 to-transparent"></div>
                  <div class="absolute bottom-5 left-5 text-white font-bold text-[20px] leading-tight flex flex-col drop-shadow-md">
                    <span>Tarjeta</span>
                    <span>Virtual</span>
                  </div>
                </div>
                <div class="p-5 h-[100px] flex flex-col justify-center">
                  <p class="text-[14px] text-slate-500 leading-snug">Compra en internet y datáfonos</p>
                </div>
              </div>

              <!-- Card 3 -->
              <div class="min-w-[260px] flex-shrink-0 bg-white rounded-[32px] shadow-xl shadow-slate-200 border border-slate-50 overflow-hidden group hover:scale-[1.02] transition-transform">
                <div class="h-36 bg-[#E11D48] relative overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div class="absolute bottom-5 left-5 text-white font-bold text-[22px]">Pagos</div>
                </div>
                <div class="p-5 h-[100px] flex flex-col justify-center">
                  <p class="text-[14px] text-slate-500 leading-snug">Recibe y envía plata a otros bancos</p>
                </div>
              </div>

            </div>
          </div>
        </main>

        <!-- Bottom Navigation Re-refinado -->
        <nav class="bg-white border-t border-slate-100 px-1 py-4 flex justify-around items-end sticky bottom-0 z-50">
          <div class="flex flex-col items-center gap-1.5 group cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-slate-400 group-hover:text-davi-red transition-colors">
              <path d="M16 3h5v5"></path>
              <path d="M8 3H3v5"></path>
              <rect x="3" y="11" width="18" height="5" rx="1"></rect>
              <path d="M12 21v-4"></path>
            </svg>
            <span class="text-[10px] font-bold text-slate-400 group-hover:text-davi-red transition-colors uppercase tracking-tight">Movimientos</span>
          </div>
          <div class="flex flex-col items-center gap-1.5 group cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-slate-400 group-hover:text-davi-red transition-colors">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span class="text-[10px] font-bold text-slate-400 group-hover:text-davi-red transition-colors uppercase tracking-tight">Tienda Virtual</span>
          </div>
          <div class="flex flex-col items-center gap-1 group cursor-pointer relative">
             <div class="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center -mt-10 bg-white shadow-xl hover:scale-110 transition-transform">
                <div class="bg-davi-red/5 p-2 rounded-lg">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7 text-davi-red">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                      <path d="M7 7h.01M17 7h.01M17 17h.01M7 17h.01"></path>
                   </svg>
                </div>
             </div>
            <span class="text-[10px] font-bold text-slate-400 group-hover:text-davi-red transition-colors uppercase tracking-tight">Código QR</span>
          </div>
          <div class="flex flex-col items-center gap-1.5 group cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-slate-400 group-hover:text-davi-red transition-colors">
              <rect x="3" y="5" width="18" height="14" rx="2"></rect>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <path d="M7 15h.01M11 15h.01M15 15h.01"></path>
            </svg>
            <span class="text-[10px] font-bold text-slate-400 group-hover:text-davi-red transition-colors uppercase tracking-tight">Pagar Servicios</span>
          </div>
        </nav>

      </div>
    </div>
  `,
  styles: `
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    :host {
      display: block;
    }
  `
})
export class WalletComponent {}
