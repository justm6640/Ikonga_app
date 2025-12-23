import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateUserWeeklyPlan } from '@/lib/ai/menu-generator';

export const dynamic = 'force-dynamic'; // Important pour éviter le cache

export async function GET(req: Request) {
  // 1. Vérification Sécurité
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("🚀 CRON START: Début de la génération des menus...");

    // 2. Récupération des utilisateurs (On log le nombre trouvé)
    // NOTE: Pour le test, on enlève temporairement le filtre isActive pour être sûr de trouver quelqu'un
    // Si ça marche, remettez { where: { isActive: true } }
    const users = await prisma.user.findMany({
        // where: { isActive: true }  <-- DÉCOMMENTEZ APRÈS LE TEST
    });

    console.log(`👥 UTILISATEURS TROUVÉS : ${users.length}`);

    if (users.length === 0) {
        return NextResponse.json({ message: "Aucun utilisateur trouvé", generated: 0 });
    }

    // 3. Exécution avec logs détaillés
    const results = await Promise.allSettled(
      users.map(async (user) => {
        console.log(`👉 Tentative pour : ${user.email || user.id}`);
        try {
            const result = await generateUserWeeklyPlan(user.id);
            if(result.success) {
                console.log(`✅ Succès pour ${user.email}`);
                return "success";
            } else {
                console.error(`❌ Échec IA pour ${user.email}:`, result.error);
                throw new Error(result.error);
            }
        } catch (e: any) {
            console.error(`❌ Crash pour ${user.email}:`, e.message);
            throw e;
        }
      })
    );

    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const errorCount = results.filter((r) => r.status === 'rejected').length;

    console.log(`🏁 CRON FINI. Succès: ${successCount}, Erreurs: ${errorCount}`);

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      generated: successCount,
      errors: errorCount
    });

  } catch (error: any) {
    console.error("🔥 CRON CRITICAL ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}