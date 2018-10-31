import getContent from './helpers/get-content'

const tabs = [
  {
    dest: '/',
    text: 'Introduction'
  },
  {
    dest: '/40-years-of-erosion',
    text: '(1) 40 Years of Erosion'
  },
  {
    dest: '/the-cycle-of-bluff-erosion',
    text: '(2) The Cycle of Bluff Erosion'
  },
  {
    dest: '/3d-map-of-ozaukee-county',
    text: '(3) 3D Map of Ozaukee County'
  },
  {
    dest: '/3d-coastal-visualization',
    text: '(4) 3D Coastal Visualization'
  }
]

export default {
  getSiteData: async () => ({
    tabs: tabs,
    title: 'Coastal Erosion Visualization',
    footerContent: await getContent('src/content/footer')
  }),
  getRoutes: async () => {
    return [
      {
        path: '/',
        component: 'src/containers/Introduction',
        getData: async () => ({
          content: await getContent('src/content/introduction'),
          slideshow: await getContent('src/content/introduction-slideshow')
        })
      },
      {
        path: '/40-years-of-erosion',
        component: 'src/containers/40YearsOfErosion'
      },
      {
        path: '/the-cycle-of-bluff-erosion',
        component: 'src/containers/TheCycleOfBluffErosion'
      },
      {
        path: '/3d-map-of-ozaukee-county',
        component: 'src/containers/3dMapOfOzaukeeCounty'
      },
      {
        path: '/3d-coastal-visualization',
        component: 'src/containers/3dCoastalVisualization'
      },
      {
        is404: true,
        component: 'src/containers/FourOhFour'
      }
    ]
  }
}
