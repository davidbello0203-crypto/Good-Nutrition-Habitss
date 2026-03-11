# Good Nutrition Habits -- Memory

## Proyecto
- **Ruta:** /Users/davidbello/good-nutrition-habits
- **Stack:** Next.js 16 + TypeScript + Inline styles (NO Tailwind en componentes) + Framer Motion + Lucide React
- **Deploy:** pendiente (Vercel recomendado)
- **Repo:** https://github.com/davidbello0203-crypto/Good-Nutrition-Habitss.git

## Cliente
- **Marca:** GOOD NUTRITION HABITS
- **Nutriologo:** L.N. Bryan Yaudiel Gil Tlatempa
- **Ciudad:** Tixtla de Guerrero, Mexico
- **WhatsApp:** 745 110 5266
- **Instagram:** @good_nutrition_habits

## Diseno -- Colores actuales
- Verde: `#28B44A` (identidad/marca)
- Naranja: `#F07820` (accion/botones), hover `#FF8C35`
- Fondo: `#080808` / `#090C08` / Cards: `#0F1208`
- Bordes: `#1A2418` / `#1E2A1C`
- Fuentes: Playfair Display (headings) + Inter (cuerpo)
- EXPO_OUT = [0.16, 1, 0.3, 1] para animaciones framer-motion

## Estructura de archivos clave
```
src/
  app/
    globals.css, layout.tsx, page.tsx
    admin/page.tsx     -- panel admin con tabs: Citas, Calendario, Clientes, Estadisticas
    dashboard/page.tsx -- panel usuario con tabs: Mis citas, Calendario, Canceladas, Mi perfil
    login/page.tsx, registro/page.tsx, confirmado/page.tsx
    api/reservas/route.ts, api/reservas/[id]/route.ts, api/email/confirmacion/route.ts
  components/
    Navbar.tsx, Hero.tsx, Services.tsx, About.tsx, Schedule.tsx, BookingCTA.tsx, Footer.tsx
    ui/ReservarFloat.tsx  -- modal de reserva (4-5 pasos con WeeklyCalendar)
    ui/WeeklyCalendar.tsx -- calendario semanal reutilizable (view/select modes)
    ui/AvatarCrop.tsx     -- crop de avatar
  lib/supabase/client.ts, server.ts
  middleware.ts           -- protege /dashboard y /admin
```

## Estado de tareas
### Fase 1 -- Landing: COMPLETA
### Fase 2 -- Auth: COMPLETA (login, registro, roles, perfil con avatar)
### Fase 3 -- Reservaciones
- ✅ Calendario de disponibilidad en tiempo real (WeeklyCalendar)
- ✅ Reservacion de citas nutricion + entrenamiento (ReservarFloat modal)
- ✅ Vista de mis reservaciones activas (dashboard)
- ✅ Cancelacion de citas por usuario
- ✅ Admin: confirmar/cancelar citas, notas, WhatsApp, CSV export
- ✅ Admin: tab Calendario con vista semanal y detalle por slot
- ✅ Dashboard: tab Calendario con isMine y click-to-book
- ✅ Cita Improvisada: admin crea citas para invitados (guest_name, guest_phone)
- ✅ Modo Limpiar admin: oculta citas canceladas (archived=true)
- ✅ Limpiar canceladas dashboard: usuarios ocultan sus propias canceladas
- ✅ PATCH /api/reservas/[id] para archivar reservas
- ⬜ Confirmacion por email automatica (Resend API key pendiente)
- ⬜ Limite de capacidad por sesion

## Pendiente inmediato
- **SQL migration pendiente** (guest_name, guest_phone, archived en tabla reservas)
- Credenciales Supabase en .env.local
- API key Resend para emails
- Deploy en Vercel
- Foto real de Bryan
- Testimonios, galeria, precios
