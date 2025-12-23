# Instrucciones para Aplicar la Migración de booking_participants

## Problema
La tabla `booking_participants` no existe en tu base de datos de Supabase, por lo que no se están registrando los participantes de las reservas.

## Solución

### Paso 1: Acceder al Dashboard de Supabase
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto de Core Padel

### Paso 2: Ejecutar el Script SQL
1. En el menú lateral izquierdo, haz clic en **SQL Editor**
2. Haz clic en **New Query** (Nueva consulta)
3. Copia todo el contenido del archivo `supabase/create_booking_participants.sql`
4. Pégalo en el editor SQL
5. Haz clic en **Run** (Ejecutar) o presiona `Ctrl+Enter` (Windows/Linux) o `Cmd+Enter` (Mac)

### Paso 3: Verificar que la Tabla se Creó
Deberías ver un mensaje de éxito. Para verificar, ejecuta esta consulta:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'booking_participants';
```

Si devuelve una fila con `booking_participants`, ¡la tabla se creó correctamente!

### Paso 4: Regenerar los Tipos de TypeScript
Después de crear la tabla, necesitas regenerar los tipos de TypeScript:

1. En el dashboard de Supabase, ve a **Project Settings** (Configuración del proyecto)
2. En el menú lateral, haz clic en **API**
3. Busca la sección **Project API keys**
4. Copia tu **service_role key** (¡guárdala de forma segura!)
5. En tu terminal, ejecuta:

```bash
npx supabase gen types typescript --project-id TU_PROJECT_ID > src/integrations/supabase/types.ts
```

O si prefieres, puedes copiar manualmente los tipos desde el dashboard:
- Ve a **API Docs** en el menú lateral
- Busca la sección de TypeScript types
- Copia los tipos generados

### Paso 5: Probar la Funcionalidad
1. Crea una nueva reserva
2. Verifica que ahora aparece "Jugadores (1/4)" en lugar de "Jugadores (0/4)"
3. El creador de la reserva debería aparecer automáticamente como participante

## Notas Adicionales
- Si ya tienes reservas existentes sin participantes, puedes ejecutar un script para agregarlos retroactivamente
- La tabla usa RLS (Row Level Security) para proteger los datos
- Los participantes pueden ser de tipo "owner" (organizador) o "player" (jugador)
