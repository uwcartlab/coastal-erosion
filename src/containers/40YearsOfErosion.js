import React from 'react'
import { RouteData } from 'react-static'
import ReactMarkdown from 'react-markdown'

var lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu cursus vitae congue mauris rhoncus. Fermentum et sollicitudin ac orci phasellus egestas tellus. Cras tincidunt lobortis feugiat vivamus at augue eget arcu. Diam vel quam elementum pulvinar etiam non quam. Aenean pharetra magna ac placerat vestibulum. Tortor aliquam nulla facilisi cras fermentum odio. Eget nunc lobortis mattis aliquam. Mauris in aliquam sem fringilla ut morbi tincidunt augue interdum. Ipsum a arcu cursus vitae congue mauris rhoncus aenean. Habitant morbi tristique senectus et. Proin sed libero enim sed faucibus turpis in eu. Consequat ac felis donec et. Suspendisse in est ante in nibh mauris cursus mattis molestie. Sed felis eget velit aliquet sagittis id consectetur purus. Lectus mauris ultrices eros in cursus turpis massa tincidunt dui. Morbi quis commodo odio aenean sed adipiscing diam donec adipiscing. Sed cras ornare arcu dui vivamus arcu felis bibendum ut. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Egestas maecenas pharetra convallis posuere.

Est placerat in egestas erat. Vestibulum sed arcu non odio euismod lacinia at quis risus. Volutpat est velit egestas dui id ornare arcu odio. Nisi lacus sed viverra tellus in hac habitasse. Netus et malesuada fames ac turpis egestas sed. Pharetra et ultrices neque ornare aenean euismod elementum nisi. Ornare quam viverra orci sagittis. Parturient montes nascetur ridiculus mus mauris vitae ultricies. Mollis aliquam ut porttitor leo a diam sollicitudin. Egestas pretium aenean pharetra magna ac. Sit amet nulla facilisi morbi tempus. Cras pulvinar mattis nunc sed blandit libero volutpat sed. Nec ullamcorper sit amet risus nullam eget felis. Condimentum lacinia quis vel eros donec ac odio. Vitae justo eget magna fermentum iaculis eu non diam. Enim tortor at auctor urna nunc. Sociis natoque penatibus et magnis dis. In nibh mauris cursus mattis molestie a iaculis at. Orci a scelerisque purus semper.

Adipiscing diam donec adipiscing tristique risus nec feugiat. In massa tempor nec feugiat. Fames ac turpis egestas maecenas pharetra convallis posuere morbi. Faucibus nisl tincidunt eget nullam non nisi est sit. Nulla pellentesque dignissim enim sit amet. Pretium quam vulputate dignissim suspendisse in est ante. Non odio euismod lacinia at quis risus sed vulputate odio. Mi quis hendrerit dolor magna eget est lorem. Dictum fusce ut placerat orci. Eget est lorem ipsum dolor.

Est ullamcorper eget nulla facilisi. Eu turpis egestas pretium aenean. Elementum curabitur vitae nunc sed velit dignissim sodales ut. Viverra accumsan in nisl nisi scelerisque eu ultrices vitae. Arcu non sodales neque sodales ut etiam sit amet nisl. Ac turpis egestas sed tempus urna et. Adipiscing elit pellentesque habitant morbi tristique senectus et. A pellentesque sit amet porttitor eget dolor. Ipsum dolor sit amet consectetur. Nulla pharetra diam sit amet. Neque convallis a cras semper auctor neque vitae tempus quam. Ac feugiat sed lectus vestibulum mattis ullamcorper velit. Lectus sit amet est placerat in egestas erat imperdiet. Ut consequat semper viverra nam libero justo laoreet. Ornare arcu odio ut sem nulla pharetra diam.

Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Ut enim blandit volutpat maecenas volutpat. Ut consequat semper viverra nam libero justo laoreet. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. Consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Habitant morbi tristique senectus et. Dignissim suspendisse in est ante in nibh mauris cursus mattis. Venenatis tellus in metus vulputate. Ullamcorper malesuada proin libero nunc. Eget est lorem ipsum dolor sit amet consectetur adipiscing elit.`

export default () => (
  <RouteData
    render={({content}) => (
      <div>
        <ReactMarkdown className="markdown-wrap" source={lorem} />
      </div>
    )}
  />
)
