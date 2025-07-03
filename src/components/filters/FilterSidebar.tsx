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
import { Filter } from '@types';

interface FilterSidebarProps {
  filters: Filter;
  onFilterChange: (key: keyof Filter, value: any) => void;
  onResetFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const genderOptions = ['men', 'women', 'unisex'];
  const classOptions = ['fitness', 'apparel', 'shoes', 'accessories'];
  const categoryOptions = ['yoga', 'activewear', 'footwear', 'equipment'];

  const handleCheckboxChange = (key: keyof Filter, value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange(key, newValues);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    onFilterChange('priceRange', newValue as [number, number]);
  };

  const activeFiltersCount = 
    filters.gender.length + 
    filters.class.length + 
    filters.category.length + 
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
          {genderOptions.map((gender) => (
            <FormControlLabel
              key={gender}
              control={
                <Checkbox
                  checked={filters.gender.includes(gender)}
                  onChange={() => handleCheckboxChange('gender', gender)}
                />
              }
              label={gender.charAt(0).toUpperCase() + gender.slice(1)}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Class</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {classOptions.map((classOption) => (
            <FormControlLabel
              key={classOption}
              control={
                <Checkbox
                  checked={filters.class.includes(classOption)}
                  onChange={() => handleCheckboxChange('class', classOption)}
                />
              }
              label={classOption.charAt(0).toUpperCase() + classOption.slice(1)}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Category</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {categoryOptions.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={filters.category.includes(category)}
                  onChange={() => handleCheckboxChange('category', category)}
                />
              }
              label={category.charAt(0).toUpperCase() + category.slice(1)}
            />
          ))}
        </AccordionDetails>
      </Accordion>

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
            {filters.gender.map((gender) => (
              <Chip
                key={gender}
                label={gender}
                onDelete={() => handleCheckboxChange('gender', gender)}
                size="small"
              />
            ))}
            {filters.class.map((classItem) => (
              <Chip
                key={classItem}
                label={classItem}
                onDelete={() => handleCheckboxChange('class', classItem)}
                size="small"
              />
            ))}
            {filters.category.map((category) => (
              <Chip
                key={category}
                label={category}
                onDelete={() => handleCheckboxChange('category', category)}
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