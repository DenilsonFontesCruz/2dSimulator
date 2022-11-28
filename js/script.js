const meshSize = 800;

let idCounter = 0;

class Mesh {
  constructor(element) {
    this.meshElement = element;
    this.meshElementList = [];
  }

  findElementById = (id) => {
    return this.meshElementList.find((e) => {
      if (e.getId() == +id) {
        return true;
      }
    });
  };

  findIndexById = (id) => {
    return this.meshElementList.findIndex((e) => {
      if (e.getId() == +id) {
        return true;
      }
    });
  };

  createMesh = (width, height) => {
    this.width = width;
    this.height = height;

    const container = document.getElementById("cont");

    container.style.minWidth = `${this.width + 8}px`;
    container.style.minHeight = `${(this.height + 8)}px`;

    this.meshElement.style.width = `${this.width}px`;
    this.meshElement.style.height = `${this.height}px`;

    const meshLayout = [];

    for (let x = 0; x < this.width; x++) {
      meshLayout.push([]);
      for (let y = 0; y < this.height; y++) {
        meshLayout[x].push(0);
      }
    }

    this.meshLayout = meshLayout;
  };

  //   addEvent = (type, callback) => {
  //     this.element.addEventListener(type, (event) => {
  //       event.preventDefault();
  //       const posX = event.x - this.element.offsetLeft;
  //       const posY = event.y - this.element.offsetTop;
  //       callback({ x: posX, y: posY }, 40, this);
  //     });
  //   };

  verifyPosition = (position, meshLayout) => {
    let permit = true;

    const rows = Object.keys(position);
    rows.forEach((row) => {
      const columns = position[row];
      columns.forEach((col) => {
        if (meshLayout[row][col] !== 0) {
          permit = false;
        }
      });
    });

    return permit;
  };

  addElement = (rectangle) => {
    const measurements = rectangle.getMeasurements();
    const position = this.getPosition(measurements);

    const positionIsValid = this.verifyPosition(position, this.meshLayout);

    if (!positionIsValid) {
      console.log("invalid place");
      return;
    }

    rectangle.setPosition(position);

    rectangle.createElement();

    const element = rectangle.getElement();

    this.meshElementList.push(rectangle);

    this.meshElement.appendChild(element);
  };

  getPosition = (measurements) => {
    const { posX, posY, sizX, sizY } = measurements;
    const meshLayout = this.meshLayout;

    const position = {};
    meshLayout.forEach((row, index) => {
      if (index + 1 >= posY && index + 1 < posY + sizY) {
        position[index] = [];
        row.forEach((column, i) => {
          if (i + 1 >= posX && i + 1 < posX + sizX) {
            position[index].push(i);
          }
        });
      }
    });

    return position;
  };

  getPositionById = (id) => {
    const meshLayout = this.meshLayout;

    const position = {};
    meshLayout.forEach((row, index) => {
      position[index] = [];
      row.forEach((column, i) => {
        if (column === id) {
          position[index].push(i);
        }
      });
    });

    return position;
  };

  getAllElementsId = () => {
    const elements = [...this.meshElement.children];
    const elementsId = [];
    elements.map((e) => {
      elementsId.push(e.id);
    });
    return elementsId;
  };

  removeElement = (id) => {
    const index = this.findIndexById(id);
    this.meshElementList[index].element.remove();
    this.meshElementList.splice(index, 1);
  };

  clearMesh = () => {
    const meshLayout = [];

    for (let x = 0; x < this.width; x++) {
      meshLayout.push([]);
      for (let y = 0; y < this.height; y++) {
        meshLayout[x].push(0);
      }
    }

    this.meshLayout = meshLayout;
  };

  updateMesh = () => {
    const elementsId = this.getAllElementsId();

    this.clearMesh();

    const meshLayout = this.meshLayout;

    elementsId.forEach((e) => {
      const element = this.findElementById(e);
      const newMeasurements = element.getNewMeasurements();
      const newPosition = this.getPosition(newMeasurements);
      let position = element.getPosition();

      if (
        Object.values(newMeasurements)[0] !== undefined &&
        newPosition &&
        JSON.stringify(position) !== JSON.stringify(newPosition)
      ) {
        const { posX, posY, sizX, sizY } = newMeasurements;

        if (
          posX < 0 ||
          posX + 1 > mesh.width ||
          posY < 0 ||
          posY + 1 > mesh.height
        ) {
          this.removeElement(e);
        }

        if (mesh.verifyPosition(newPosition, meshLayout)) {
          element.setPosition(newPosition);
          element.setMeasurements(newMeasurements);
        } else {
          element.setNewMeasurements(element.getMeasurements());
        }
      }

      position = element.getPosition();

      const rows = Object.keys(position);

      if (rows.length === 0) {
        this.removeElement(e);
      }

      rows.forEach((row) => {
        const columns = position[row];
        columns.forEach((col) => {
          meshLayout[row][col] = +e;
        });
      });

      element.drawElement();
    });

    this.meshLayout = meshLayout;
  };
}

class Rectangle {
  constructor({ posX, posY, sizX, sizY }) {
    this.posX = posX;
    this.posY = posY;
    this.sizX = sizX;
    this.sizY = sizY;
  }

  createElement = () => {
    this.id = ++idCounter;
    const element = document.createElement("div");
    element.setAttribute("id", this.id);
    element.setAttribute("class", "object");

    this.element = element;
  };

  drawElement = () => {
    const element = this.element;

    element.style.width = `${this.sizX}px`;
    element.style.height = `${this.sizY}px`;
    element.style.left = `${this.posX}px`;
    element.style.top = `${this.posY}px`;

    this.element = element;
  };

  setPosition = (position) => {
    this.position = position;
  };

  getPosition = () => {
    return this.position;
  };

  getElement = () => {
    return this.element;
  };

  getId = () => {
    return this.id;
  };

  setMeasurements = ({ posX, posY, sizX, sizY }) => {
    this.posX = posX;
    this.posY = posY;
    this.sizX = sizX;
    this.sizY = sizY;
  };

  setNewMeasurements = ({ posX, posY, sizX, sizY }) => {
    this.newPosX = posX;
    this.newPosY = posY;
    this.newSizX = sizX;
    this.newSizY = sizY;
  };

  getMeasurements = () => {
    const { posX, posY, sizX, sizY } = this;

    return {
      posX,
      posY,
      sizX,
      sizY,
    };
  };

  getNewMeasurements = () => {
    const { newPosX, newPosY, newSizX, newSizY } = this;

    return {
      posX: newPosX,
      posY: newPosY,
      sizX: newSizX,
      sizY: newSizY,
    };
  };
}

const addRectangle = (positon, size) => {
  const rectangle = new Rectangle({
    posX: positon.x,
    posY: positon.y,
    sizX: size.x,
    sizY: size.y,
  });

  mesh.addElement(rectangle);
};

const moveToRectangle = (id, position) => {
  const element = mesh.findElementById(id);
  const measurements = element.getMeasurements();
  const newMeasurements = {
    ...measurements,
    posX: position.x,
    posY: position.y,
  };

  element.setNewMeasurements(newMeasurements);
};

// Create Mesh
const meshElement = document.getElementById("mesh");
const mesh = new Mesh(meshElement);
mesh.createMesh(meshSize, meshSize);

addRectangle({ x: 20, y: 40 }, { x: 50, y: 50 });
addRectangle({ x: 80, y: 120 }, { x: 100, y: 50 });
addRectangle({ x: -1, y: -1 }, { x: 2, y: 2 });

setInterval(() => {
  mesh.updateMesh();
}, 100);
