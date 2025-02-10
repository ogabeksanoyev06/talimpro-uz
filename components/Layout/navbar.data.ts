import { useI18n } from 'vue-i18n'

import { useTourStore } from '~/store/tours'
import type { ITourType } from '~/types/tour'

export const navbarLinks = () => {
  const { t } = useI18n()
  const tourTypes = useTourStore().tourTypes.list
  return [
    {
      title: t('tours'),
      route: '/tours',
    },
    ...tourTypes.map((item: ITourType) => ({
      title: item.name,
      route: `/tours/type/${item.id}`,
    })),
    {
      title: t('contacts'),
      route: '/contacts',
    },
  ]
}
