import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Chip,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Filter } from '../../types';

interface FilterSidebarProps {
  filters: Filter;
  onFilterChange: (key: keyof Filter, value: unknown) => void;
  onResetFilters: () => void;
  facets?: Record<string, Record<string, number>>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  facets,
}) => {
  // Use facets from Algolia if available, otherwise fall back to static options
  const genderOptions = facets?.['gender.title'] ? Object.keys(facets['gender.title']) : ['men', 'women', 'unisex'];
  const categoryOptions = facets?.['category.title'] ? Object.keys(facets['category.title']) : ['yoga', 'activewear', 'footwear', 'equipment'];
  const subCategoryOptions = facets?.['sub_category.title'] ? Object.keys(facets['sub_category.title']) : [];
  const colorOptions = facets?.['sku.color.title'] ? Object.keys(facets['sku.color.title']) : [];
  const sizeOptions = facets?.['sku.size.title'] ? Object.keys(facets['sku.size.title']) : [];

  const handleCheckboxChange = (key: keyof Filter, value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues?.includes(value)
      ? currentValues?.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange(key, newValues);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    onFilterChange('priceRange', newValue as [number, number]);
  };

  const activeFiltersCount = 
    filters.gender?.length + 
    filters.category?.length + 
    filters.subCategory?.length +
    filters.color?.length +
    filters.size?.length +
    (filters.inStock ? 1 : 0);

  return (
    <Box sx={{ width: '100%', maxWidth: 280 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        {activeFiltersCount > 0 && (
          <Button size="small" onClick={onResetFilters}>
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Gender</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {genderOptions.map((gender: string) => {
            const count = facets?.['gender.title']?.[gender] || 0;
            return (
              <FormControlLabel
                key={gender}
                control={
                  <Checkbox
                    checked={filters.gender?.includes(gender)}
                    onChange={() => handleCheckboxChange('gender', gender)}
                  />
                }
                label={`${gender.charAt(0).toUpperCase() + gender.slice(1)} (${count})`}
              />
            );
          })}
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Category</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {categoryOptions.map((category: string) => {
            const count = facets?.['category.title']?.[category] || 0;
            return (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={filters.category?.includes(category)}
                    onChange={() => handleCheckboxChange('category', category)}
                  />
                }
                label={`${category.charAt(0).toUpperCase() + category.slice(1)} (${count})`}
              />
            );
          })}
        </AccordionDetails>
      </Accordion>

      {subCategoryOptions.length > 0 && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Sub Category</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {subCategoryOptions.map((subCategory: string) => {
              const count = facets?.['sub_category.title']?.[subCategory] || 0;
              return (
                <FormControlLabel
                  key={subCategory}
                  control={
                    <Checkbox
                      checked={filters.subCategory?.includes(subCategory)}
                      onChange={() => handleCheckboxChange('subCategory', subCategory)}
                    />
                  }
                  label={`${subCategory.charAt(0).toUpperCase() + subCategory.slice(1)} (${count})`}
                />
              );
            })}
          </AccordionDetails>
        </Accordion>
      )}

      {colorOptions.length > 0 && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Color</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {colorOptions.map((color: string) => {
              const count = facets?.['sku.color.title']?.[color] || 0;
              return (
                <FormControlLabel
                  key={color}
                  control={
                    <Checkbox
                      checked={filters.color?.includes(color)}
                      onChange={() => handleCheckboxChange('color', color)}
                    />
                  }
                  label={`${color.charAt(0).toUpperCase() + color.slice(1)} (${count})`}
                />
              );
            })}
          </AccordionDetails>
        </Accordion>
      )}

      {sizeOptions?.length && sizeOptions.length > 0 && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Size</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {sizeOptions.map((size: string) => {
              const count = facets?.['sku.size.title']?.[size] || 0;
              return (
                <FormControlLabel
                  key={size}
                  control={
                    <Checkbox
                      checked={filters.size?.includes(size)}
                      onChange={() => handleCheckboxChange('size', size)}
                    />
                  }
                  label={`${size.charAt(0).toUpperCase() + size.slice(1)} (${count})`}
                />
              );
            })}
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              marks={[
                { value: 0, label: '$0' },
                { value: 500, label: '$500' },
                { value: 1000, label: '$1000' },
              ]}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Availability</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.inStock}
                onChange={(e) => onFilterChange('inStock', e.target.checked)}
              />
            }
            label="In Stock Only"
          />
        </AccordionDetails>
      </Accordion>

      {activeFiltersCount > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.gender?.map((gender) => (
              <Chip
                key={gender}
                label={gender}
                onDelete={() => handleCheckboxChange('gender', gender)}
                size="small"
              />
            ))}
            {filters.category?.map((category) => (
              <Chip
                key={category}
                label={category}
                onDelete={() => handleCheckboxChange('category', category)}
                size="small"
              />
            ))}
            {filters.subCategory?.map((subCategory) => (
              <Chip
                key={subCategory}
                label={subCategory}
                onDelete={() => handleCheckboxChange('subCategory', subCategory)}
                size="small"
              />
            ))}
            {filters.color?.map((color) => (
              <Chip
                key={color}
                label={color}
                onDelete={() => handleCheckboxChange('color', color)}
                size="small"
              />
            ))}
            {filters.size?.map((size) => (
              <Chip
                key={size}
                label={size}
                onDelete={() => handleCheckboxChange('size', size)}
                size="small"
              />
            ))}
            {filters.inStock && (
              <Chip
                label="In Stock"
                onDelete={() => onFilterChange('inStock', false)}
                size="small"
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FilterSidebar;