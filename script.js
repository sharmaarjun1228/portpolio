document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapse = document.getElementById('sidebarCollapse');
  
    // Ensure the sidebarCollapse element exists before attaching event listeners
    if (sidebarCollapse) {
      // Toggle sidebar on button click
      sidebarCollapse.addEventListener('click', function () {
        sidebar.classList.toggle('active');
      });
  
      // Close sidebar when clicking outside of it
      document.addEventListener('click', function (event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickInsideToggle = sidebarCollapse.contains(event.target);
  
        if (!isClickInsideSidebar && !isClickInsideToggle && sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
        }
      });
  
      // Close sidebar when clicking on a nav link (for mobile)
      const navLinks = sidebar.querySelectorAll('.nav-link');
      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
          }
        });
      });
    }
  
    // Fetch projects data
    fetch('projects.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const projects = data.sort((a, b) => a.serial - b.serial);
        const categories = ["all", "EDA", "SQL", "PowerBI", "Tableau"];
        const initialLoad = 6;
  
        function displayProjects(container, category) {
          const filteredProjects = projects.filter(function (project) {
            return category === "all" || project.category.toLowerCase() === category.toLowerCase();
          });
  
          let currentIndex = 0;
  
          function loadMore() {
            const endIndex = currentIndex + initialLoad;
            const projectsToDisplay = filteredProjects.slice(currentIndex, endIndex);
  
            projectsToDisplay.forEach(function (project) {
              const projectCard = `
                <div class="col-md-4 mb-4">
                  <div class="card project-card">
                    <div class="card-body">
                      <h5 class="card-title">${project.title}</h5>
                      <p class="card-text">${project.description}</p>
                      <a href="${project.link}" class="btn btn-primary" target="_blank">View Project</a>
                    </div>
                  </div>
                </div>
              `;
              document.getElementById(`${container}-container`).insertAdjacentHTML('beforeend', projectCard);
            });
  
            currentIndex = endIndex;
            if (currentIndex >= filteredProjects.length) {
              document.getElementById(`load-more-${container}`).style.display = 'none';
            }
          }
  
          loadMore();
          document.getElementById(`load-more-${container}`).addEventListener('click', loadMore);
        }
  
        categories.forEach(function (category) {
          displayProjects(category.toLowerCase(), category);
        });
      })
      .catch(error => console.error('There was a problem with the fetch operation:', error));
  
    // Update visit count (using local storage)
    function updateVisitCount() {
      let visitCount = localStorage.getItem('visitCount') || 0;
      visitCount++;
      localStorage.setItem('visitCount', visitCount);
      document.getElementById('visit-count').textContent = visitCount;
    }
  
    // Call function to update and display the visit count
    updateVisitCount();
  });
  