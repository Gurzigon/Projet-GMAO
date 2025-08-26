import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();
async function main() {
    console.log("🌱 Démarrage du seeding...");
    // Seeding table Status
    const statuses = ['demandé', 'en cours', 'terminée'];
    for (const label of statuses) {
        await prisma.status.upsert({
            where: { label },
            update: {},
            create: {
                label,
            },
        });
    }
    console.log('✅ Statuts insérés avec succès');
    // Seeding table Category
    const categories = [
        {
            label: "tracteur"
        }
    ];
    for (const category of categories) {
        await prisma.category.upsert({
            where: { label: category.label },
            update: {},
            create: {
                label: category.label,
            },
        });
    }
    console.log('✅ Catégories insérées avec succès');
    // Seeding table Priority
    const priorities = ["urgent", "classique"];
    for (const label of priorities) {
        await prisma.priority.upsert({
            where: { label },
            update: {},
            create: {
                label,
            },
        });
    }
    console.log('✅ Priorités insérés avec succès');
    // Seeding table Service
    const services = ["atelier", "services généraux"];
    for (const label of services) {
        await prisma.service.upsert({
            where: { label },
            update: {},
            create: {
                label,
            },
        });
    }
    console.log('✅ Services insérés avec succès');
    // Sedding table Role
    const roles = ["demandeur", "technicien", "responsable", "administrateur"];
    for (const label of roles) {
        await prisma.role.upsert({
            where: { label },
            update: {},
            create: {
                label,
            },
        });
    }
    console.log('✅ Rôles insérés avec succès');
    // Seeding table Matériel
    const materialNames = [
        "Rouleau faca",
        "Rouleau Beli",
        "Brosse rotative plastique fait maison",
        "Rotavator vigne",
        "Cerveaux moteur boisselet",
        "Arromatic",
        "Pelle a remonter les bouts Guyard",
        "Deca Souslikoff",
        "Deca Boisselet",
        "Deca mono rang",
        "Rogneuse collar double rang",
        "Rogneuse mono rang",
        "Rogneuse coup eco",
        "Semoir APV",
        "Disque emoteur triple",
        "Disque boisselet pulvériseur",
        "Disque emoteur double",
        "Buttoir boisselet",
        "Semoir chollet service bleu",
        "Racleur téflon jaune",
        "Peigne",
        "Brosse métallique boisselet",
        "Rotofil AVIF",
        "Rotofil AMG",
        "Lame intercept brown",
        "Rogneuse pellenc",
        "Broyeur a sarment boisselet",
        "Tarriere boisselet",
        "Tarriere souslicoff",
        "Prétailleuse pellenc",
        "Effeuilleuse",
        "Pulvé 1035",
        "Pulvé mono rang",
        "Pulvé tractis",
        "Pulvé TS",
        "Pulvé MT",
        "Pulvé Tecnoma",
        "Machine a tirer les fils",
        "Machine a enrouler les fils",
        "Epareuse",
        "Epareuse taille haie",
        "Treuil",
        "Machine a soufrée",
        "Baliseuse",
        "Broyeur thermique RABOT",
        "Brouette électrique",
        "Jeu de griffes double rang",
        "Jeu de griffes mono rang",
        "Disque boisselet",
        "Disque braun",
        "Brouette maçon",
        "Cheminé broyeur",
        "Charriot épamprage",
        "Compresseur effeuilleuse",
        "Brouette de sarmentage",
        "Tarière boisselet",
        "Rol’ n sem",
        "Tondeuse Boisselet Coupe 45",
        "Tondeuse Boisselet Coupe 50",
    ];
    const service = await prisma.service.findUnique({
        where: { label: "atelier" },
    });
    const category = await prisma.category.findUnique({
        where: { label: "tracteur" },
    });
    if (!service || !category) {
        throw new Error("Service ou catégorie introuvable !");
    }
    for (const name of materialNames) {
        await prisma.material.upsert({
            where: { name },
            update: {
                serviceId: service.id,
                categoryId: category.id,
                updated_at: new Date(),
            },
            create: {
                name,
                mimetype: 'application/octet-stream', // valeur par défaut
                is_store: false,
                serviceId: service.id,
                categoryId: category.id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }
    console.log("✅ Matériels insérées avec succès");
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error('❌ Erreur pendant le seeding :', e);
    await prisma.$disconnect();
    process.exit(1);
});
