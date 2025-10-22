# Docker Toy Project (Node.js + ECS + ECR CI/CD)

## 🧩 구성
- Node.js (ToDo + Chat)
- MongoDB
- Telegraf + InfluxDB + Grafana (Monitoring)
- AWS ECS + ECR (CI/CD 자동 배포)

## 🚀 배포 플로우
1. `main` 브랜치에 코드 push  
2. GitHub Actions가 자동 실행  
3. Docker 이미지 빌드 → ECR 푸시  
4. ECS 서비스 강제 재배포 (`force-new-deployment`)  
5. 새로운 컨테이너 자동 실행  

## 🧠 시연 시나리오
| 단계 | 내용 |
|------|------|
| v1 | ToDo + Chat 기능만 포함 |
| v2 | Weather 기능 추가 → 자동 빌드 및 ECS 재배포 확인 |

Grafana에서 ECS 컨테이너 재시작 및 리소스 변화도 실시간으로 확인 가능 ✅
