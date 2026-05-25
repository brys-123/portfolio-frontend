// ── API BASE URL ──
const API_URL = 'https://portfolio-backend-ezd6.onrender.com';

// ── LOAD SKILLS ──
// ── LOAD SKILLS ──
async function loadSkills() {
  try {
    const response = await fetch(`${API_URL}/api/skills`);
    const data = await response.json();

    const skillLevels = {
      'Python':      'Excellent',
      'PHP':         'Good',
      'Excel':       'Excellent',
      'Power BI':    'Good',
      'R':           'Excellent',
      'HTML':        'Good',
      'CSS':         'Good',
      'JavaScript':  'Good',
    };

    const container = document.getElementById('skills-container');
    container.innerHTML = `
      <table class="skills-table">
        <thead>
          <tr>
            <th>Tool / Language</th>
            <th>Proficiency Level</th>
          </tr>
        </thead>
        <tbody>
          ${data.skills.map(skill => `
            <tr>
              <td>${skill}</td>
              <td>
                <span class="level-badge level-${(skillLevels[skill] || 'Good').toLowerCase()}">
                  ${skillLevels[skill] || 'Good'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

  } catch (error) {
    document.getElementById('skills-container').innerHTML =
      '<p class="loading">Could not load skills.</p>';
  }
}

// ── LOAD PROJECTS ──
async function loadProjects() {
  try {
    const response = await fetch(`${API_URL}/api/projects`);
    const data = await response.json();

    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    data.projects.forEach(project => {
      const card = document.createElement('div');
      card.classList.add('project-card');

      const techTags = project.tech
        .map(t => `<span class="tech-tag">${t}</span>`)
        .join('');

      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tech">${techTags}</div>
        <a href="${project.link}" target="_blank" class="project-link">
          View Project →
        </a>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    document.getElementById('projects-container').innerHTML =
      '<p class="loading">Could not load projects.</p>';
  }
}

// ── CONTACT FORM ──
async function handleContact(e) {
  e.preventDefault();

  const name    = document.getElementById('name').value;
  const email   = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const responseEl = document.getElementById('form-response');

  responseEl.textContent = 'Sending...';

  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const data = await response.json();

    if (response.ok) {
      responseEl.textContent = data.message;
      responseEl.style.color = '#00d4ff';
      document.getElementById('contact-form').reset();
    } else {
      responseEl.textContent = data.error || 'Something went wrong.';
      responseEl.style.color = '#ff6584';
    }

  } catch (error) {
    responseEl.textContent = 'Could not send message. Try again later.';
    responseEl.style.color = '#ff6584';
  }
}

// ── SMOOTH NAVBAR SCROLL ──
function handleNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(5, 5, 16, 0.95)';
    } else {
      navbar.style.background = 'rgba(5, 5, 16, 0.75)';
    }
  });
}

// ── SCROLL REVEAL ANIMATION ──
function handleScrollReveal() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(section);
  });
}

// ── RUN EVERYTHING ──
document.addEventListener('DOMContentLoaded', () => {
  loadSkills();
  loadProjects();
  handleNavbar();
  handleScrollReveal();

  document
    .getElementById('contact-form')
    .addEventListener('submit', handleContact);
  // Mobile nav toggle
  const burger = document.getElementById('nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // close nav when clicking a link
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
    // ensure nav closes when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) navLinks.classList.remove('open');
    });
  }
});