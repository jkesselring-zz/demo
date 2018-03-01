<?php namespace Demo;
  class Render {
    function speak() {
      echo "I'm here now.";
    }
  }

  $renderer = new Render();
  $renderer->speak();

?>
