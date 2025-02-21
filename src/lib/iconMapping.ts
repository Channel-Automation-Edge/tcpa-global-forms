import Bathtub from '@/components/icons/Bathtub';
import Trowel from '@/components/icons/Trowel';
import Closet from '@/components/icons/Closet';
import Plumbing from '@/components/icons/Plumbing';
import Deck from '@/components/icons/Deck';
import Garage from '@/components/icons/Garage';
import Gutter from '@/components/icons/Gutter';
import Foundation from '@/components/icons/Foundation';
import Flooring from '@/components/icons/Floor';
import Kitchen from '@/components/icons/Kitchen';
import Roofing from '@/components/icons/Roofing';
import Siding from '@/components/icons/Siding';
import Shower from '@/components/icons/Shower';
import Windows from '@/components/icons/Windows';
import Fence from '@/components/icons/Fence';
import Doors from '@/components/icons/Doors';
import Solar from '@/components/icons/Solar';
import Insulation from '@/components/icons/Insulation';

const iconMapping: Record<string, React.ElementType> = {
  Bath: Bathtub,
  "Basement Waterproofing": Trowel,
  Closet: Closet,
  Plumbing: Plumbing,
  Deck: Deck,
  Doors: Doors,
  Fence: Fence,
  Flooring: Flooring,
  Garage: Garage,
  Gutters: Gutter,
  Foundation: Foundation,
  Kitchen: Kitchen,
  Roofing: Roofing,
  Siding: Siding,
  Shower: Shower,
  Windows: Windows,
  Solar: Solar,
  Insulation: Insulation,
};

export default iconMapping;