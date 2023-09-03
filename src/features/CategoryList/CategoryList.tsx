import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type {
  Category,
  CategoryReference,
  ClientResponse,
  LocalizedString,
} from '@commercetools/platform-sdk';

import { projectKey } from '../../api/apiConfig';
import { apiRoot } from '../../api/apiHelpers';
import './CategoryList.scss';

interface CategoryItem {
  id: string;
  name: LocalizedString;
  url: LocalizedString;
  ancestors: CategoryReference[];
  parent: CategoryReference | undefined;
}
interface ActiveItem {
  id: string;
  name: string;
  path?: string;
  pathid?: string;
}

const getCategoryList = async () => {
  let response: ClientResponse<{ results: Category[] }> | null = null;

  try {
    response = await apiRoot.withProjectKey({ projectKey }).categories().get().execute();

    if (response) {
      const categoryList = response.body.results.map((category: Category) => {
        return {
          id: category.id,
          name: category.name,
          url: category.slug,
          ancestors: category.ancestors,
          parent: category.parent,
        };
      });

      return categoryList;
    }
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.log(error);
  }
};

interface Props {
  handleActiveCategory: (item: ActiveItem) => void;
  newId: string;
}

const CategoryList = ({ handleActiveCategory, newId }: Props) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    getCategoryList()
      .then((categoryList) => {
        setCategories(categoryList ?? []);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching category:', error);
      });
  }, []);

  const [activeCategory, setActiveCategory] = useState('');

  const showBread = (item: CategoryItem) => {
    const id = item.id;
    const name = item.name['en-US'];
    const breadItem = categories
      .filter((cat) => item.parent && cat.id === item.ancestors[0].id)
      .map((item) => item.name['en-US']);
    const path = item.parent ? breadItem.join('/') + ' /' : '';
    const pathid = item.parent ? item.ancestors[0].id : '';
    handleActiveCategory({ id, name, path, pathid });
    setActiveCategory(id);
  };

  useEffect(() => {
    setActiveCategory(newId);
  }, [newId]);

  const [categoryView, setCategoryView] = useState<boolean>(false);
  const toggleList = (): void => {
    setCategoryView((prevValue) => !prevValue);
  };

  const getSubcategory = (parents: string) => {
    return (
      <>
        {categories
          .filter((item) => item.parent && item.parent.id === parents)
          .map((subcategory) => (
            <li
              key={subcategory.id}
              className={
                subcategory.id === activeCategory ? 'category__item--active' : 'category__item'
              }
            >
              <Link
                onClick={(e) => {
                  e.stopPropagation();
                  showBread(subcategory);
                }}
                to={`/products/category/${subcategory.id}`}
              >
                {subcategory.name['en-US']}
              </Link>
            </li>
          ))}
      </>
    );
  };

  return (
    <div className='category'>
      <button className='category__btn' onClick={toggleList}>
        Categories
      </button>
      <ul className={categoryView === true ? 'category__list--active' : 'category__list'}>
        {categories
          .filter((item) => item.parent === undefined)
          .map((category) => (
            <li
              key={category.id}
              className={
                category.id === activeCategory ? 'category__item--active' : 'category__item'
              }
            >
              <Link to={`/products/category/${category.id}`} onClick={() => showBread(category)}>
                {category.name['en-US']}
              </Link>
              <ul className='category__sublist'>{getSubcategory(category.id)}</ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CategoryList;
