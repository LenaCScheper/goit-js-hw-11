export default async(name, page) => {
    try {
        const picturesList = await fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${name}&page=${page}&per_page=9&key=24794721-8b40f8604d43363d1fa3375eb`);
        return picturesList.json();
    } catch (error) {
        return error;
    }
}