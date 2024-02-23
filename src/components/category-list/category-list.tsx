import './category-list.css';

function CategoryList({ categories, selectCategory }) {

  return (
    <>
      <div className="category-list">
        <span className="category-list-title">Category</span>
        <button key="cat-all" type="button" className="category-button btn btn-link d-block" onClick={() => selectCategory(null)} >All</button>
        {
          categories?.map((category, index) => {
            if (index < 20)
              return <button key={`cat-${category.name}`} type="button" className="category-button btn btn-link d-block" onClick={() => selectCategory(category.name)}>{category.name} ({category.count})</button>
            else return '';
          })
        }
      </div>
    </>
  );
}

export default CategoryList;
