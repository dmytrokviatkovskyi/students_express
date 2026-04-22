// Приклад додавання видалення в роути
router.post('/delete/:id', async (req, res) => {
    try {
        await deleteArtifact(req.params.id);
        res.redirect('/artifacts/inventory'); // Повертаємося до списку після видалення
    } catch (err) {
        res.status(500).send(err.message);
    }
});
