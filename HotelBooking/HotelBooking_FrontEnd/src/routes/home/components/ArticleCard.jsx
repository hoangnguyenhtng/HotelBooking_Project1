const ArticleCard = ({ title, image, description, link }) => (
    <div className="border rounded-lg overflow-hidden shadow-lg">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-gray-600">{description}</p>
            <a href={link} className="text-blue-500 mt-4 inline-block">
                Xem thêm &rarr;
            </a>
        </div>
    </div>
);

// Thêm danh sách bài viết vào trang chủ
<div className="my-8">
    <h2 className="text-3xl font-medium text-slate-700 text-center mb-4">
        Khám phá du lịch
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
            <ArticleCard
                key={article.id}
                title={article.title}
                image={article.imageUrl}
                description={article.description}
                link={article.link}
            />
        ))}
    </div>
</div>
