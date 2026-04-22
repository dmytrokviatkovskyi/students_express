import { getAllArtifacts } from '../controllers/artifactController.js';

router.get('/inventory', async (req, res) => {
    const items = await getAllArtifacts();
    res.render('inventory_page', { items }); // Відмалювати через HBS (який є у вашому package.json)
});
